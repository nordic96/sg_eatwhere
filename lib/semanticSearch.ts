import { isDebugMode } from '@/app/config/envMode';
import { SearchableData } from '@/app/utils/searchUtils';

// Type for pending message handlers with request ID correlation
type MessageHandler = {
  resolve: (value: string[]) => void;
  reject: (error: Error) => void;
};

export class SemanticSearchClient {
  private worker: Worker | null = null;
  private isReady = false;
  private isDestroyed = false;
  private initPromise: Promise<void> | null = null;
  private embeddingsReadyResolve: (() => void) | null = null;
  // Use Map with request IDs to fix race condition - responses are matched to requests by ID
  private messageQueue: Map<string, MessageHandler> = new Map();

  constructor() {
    // Don't auto-initialize - defer until generateEmbeddings() is called
    // This prevents the model from loading on pages that don't use search
  }

  private initWorker(): Promise<void> {
    // Prevent re-initialization if already initialized or destroyed
    if (this.initPromise && !this.isDestroyed) {
      return this.initPromise;
    }

    // Reset destroyed state when re-initializing
    this.isDestroyed = false;

    this.initPromise = new Promise((resolve, reject) => {
      try {
        this.worker = new Worker(new URL('../app/workers/embedding-worker.ts', import.meta.url), {
          type: 'module',
        });

        this.worker.onmessage = (event) => {
          const { type, data } = event.data;

          switch (type) {
            case 'EMBEDDINGS_READY':
              this.isReady = true;
              if (isDebugMode()) console.log('Embeddings ready:', data.embeddings.length, 'items');
              // Resolve the embeddings generation promise
              if (this.embeddingsReadyResolve) {
                this.embeddingsReadyResolve();
                this.embeddingsReadyResolve = null;
              }
              break;

            case 'SEARCH_RESULTS': {
              // Resolve the pending search promise using requestId to match the correct handler
              // This fixes the race condition where responses could resolve wrong promises
              const requestId = data.requestId;
              const handler = this.messageQueue.get(requestId);
              if (handler) {
                handler.resolve(data.results);
                this.messageQueue.delete(requestId);
              }
              break;
            }

            case 'ERROR': {
              if (isDebugMode()) console.error('Worker error:', data.error);
              // Use requestId to reject the correct promise
              const errorRequestId = data.requestId;
              if (errorRequestId) {
                const errorHandler = this.messageQueue.get(errorRequestId);
                if (errorHandler) {
                  errorHandler.reject(new Error(data.error));
                  this.messageQueue.delete(errorRequestId);
                }
              }
              break;
            }
          }
        };

        this.worker.onerror = (error) => {
          console.error('Worker error:', error);
          reject(error);
        };

        // Worker is created, resolve the init promise
        resolve();
      } catch (error) {
        console.error('Failed to create worker:', error);
        reject(error);
      }
    });

    return this.initPromise;
  }

  /**
   * Ensure the worker is initialized (re-initialize if destroyed)
   */
  private async ensureWorker(): Promise<void> {
    if (this.isDestroyed || !this.worker) {
      await this.initWorker();
    }
  }

  /**
   * Generate embeddings for all food data (call once on app load)
   */
  async generateEmbeddings(foodData: SearchableData[]): Promise<void> {
    await this.ensureWorker();

    if (!this.worker) {
      throw new Error('Worker failed to initialize');
    }

    return new Promise((resolve, reject) => {
      // Store the resolve function to be called when EMBEDDINGS_READY is received
      this.embeddingsReadyResolve = resolve;

      // Set a timeout to prevent hanging
      const timeout = setTimeout(() => {
        if (!this.isReady) {
          this.embeddingsReadyResolve = null;
          reject(new Error('Embeddings generation timed out'));
        }
      }, 120000); // 2 minute timeout for model loading + embedding generation

      // Clear timeout when resolved
      const originalResolve = this.embeddingsReadyResolve;
      this.embeddingsReadyResolve = () => {
        clearTimeout(timeout);
        originalResolve?.();
      };

      this.worker!.postMessage({
        type: 'GENERATE_EMBEDDINGS',
        data: { foodData },
      });
    });
  }

  /**
   * Search for food items by semantic similarity
   */
  async search(query: string, topK: number = 10): Promise<string[]> {
    if (!this.isReady) {
      console.warn('Embeddings not ready yet');
      return [];
    }

    await this.ensureWorker();

    if (!this.worker) {
      throw new Error('Worker failed to initialize');
    }

    return new Promise((resolve, reject) => {
      // Generate unique request ID to correlate request/response and fix race condition
      const requestId = crypto.randomUUID();

      // Set a timeout to prevent hanging promises
      const timeout = setTimeout(() => {
        // Remove this request from the queue by ID
        if (this.messageQueue.has(requestId)) {
          this.messageQueue.delete(requestId);
        }
        reject(new Error('Search query timed out'));
      }, 10000); // 10 second timeout for individual searches

      // Wrap resolve to clear timeout
      const wrappedResolve = (value: string[]) => {
        clearTimeout(timeout);
        resolve(value);
      };

      // Wrap reject to clear timeout
      const wrappedReject = (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      };

      // Store handler with request ID for correlation
      this.messageQueue.set(requestId, { resolve: wrappedResolve, reject: wrappedReject });

      // Send search query - embeddings are now cached in worker, no need to send them
      // This fixes the memory performance issue
      this.worker!.postMessage({
        type: 'SEARCH_QUERY',
        data: {
          query,
          topK,
          requestId,
        },
      });
    });
  }

  /**
   * Check if embeddings are ready
   */
  getReadyState(): boolean {
    return this.isReady;
  }

  /**
   * Clean up worker
   */
  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.isDestroyed = true;
    this.initPromise = null;
    // Note: We keep embeddings and isReady state intact
    // so that if re-initialized, we know we need to regenerate
  }
}

// Singleton instance
let searchClient: SemanticSearchClient | null = null;

export function getSemanticSearchClient(): SemanticSearchClient {
  // Create a new instance if none exists or if the previous one was destroyed
  if (!searchClient) {
    searchClient = new SemanticSearchClient();
  }
  return searchClient;
}

/**
 * Reset the singleton (useful for testing or full cleanup)
 */
export function resetSemanticSearchClient(): void {
  if (searchClient) {
    searchClient.destroy();
    searchClient = null;
  }
}
