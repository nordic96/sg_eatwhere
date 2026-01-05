/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/semanticSearch.ts
import { SearchableData } from '@/app/utils/searchUtils';

export class SemanticSearchClient {
  private worker: Worker | null = null;
  private embeddings: Array<{ id: string; embedding: number[] }> = [];
  private isReady = false;
  private isDestroyed = false;
  private initPromise: Promise<void> | null = null;
  private embeddingsReadyResolve: (() => void) | null = null;
  private messageQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initWorker();
    }
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
              this.embeddings = data.embeddings;
              this.isReady = true;
              console.log('Embeddings ready:', this.embeddings.length, 'items');
              // Resolve the embeddings generation promise
              if (this.embeddingsReadyResolve) {
                this.embeddingsReadyResolve();
                this.embeddingsReadyResolve = null;
              }
              break;

            case 'SEARCH_RESULTS':
              // Resolve the pending search promise
              if (this.messageQueue.length > 0) {
                const { resolve } = this.messageQueue.shift()!;
                resolve(data.results);
              }
              break;

            case 'ERROR':
              console.error('Worker error:', data.error);
              if (this.messageQueue.length > 0) {
                const { reject } = this.messageQueue.shift()!;
                reject(new Error(data.error));
              }
              break;
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
      this.messageQueue.push({ resolve, reject });

      this.worker!.postMessage({
        type: 'SEARCH_QUERY',
        data: {
          query,
          embeddings: this.embeddings,
          topK,
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
