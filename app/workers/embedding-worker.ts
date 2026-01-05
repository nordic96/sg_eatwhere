/* eslint-disable @typescript-eslint/no-explicit-any */
import { pipeline, cos_sim } from '@huggingface/transformers';
import { SearchableData } from '../utils/searchUtils';

// Singleton pattern for model
let embedder: any = null;

// Cache embeddings in worker to avoid repeated postMessage transfers
// This fixes the memory performance issue where embeddings were sent on every search
let cachedEmbeddings: Array<{ id: string; embedding: number[] }> = [];

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');
  }
  return embedder;
}

// Message handler
self.onmessage = async (event) => {
  const { type, data } = event.data;

  try {
    const model = await getEmbedder();

    switch (type) {
      case 'GENERATE_EMBEDDINGS': {
        // Pre-generate embeddings for all food items
        const { foodData } = data;

        const embeddings = await Promise.all(
          foodData.map(async (food: SearchableData) => {
            const text = [
              food.name,
              food.desc,
              food.category,
              food.location.address,
              food.location.region,
              food.recommendations?.join(' '),
            ]
              .filter(Boolean)
              .join(' ');

            const output = await model(text, {
              pooling: 'mean',
              normalize: true,
            });

            return {
              id: food.id,
              embedding: Array.from(output.data),
            };
          }),
        );

        // Cache embeddings in worker for subsequent searches
        cachedEmbeddings = embeddings;

        self.postMessage({
          type: 'EMBEDDINGS_READY',
          data: { embeddings },
        });
        break;
      }

      case 'SEARCH_QUERY': {
        // Encode user query - use cached embeddings instead of receiving them each time
        const { query, topK, requestId } = data;

        // Use cached embeddings from GENERATE_EMBEDDINGS
        if (cachedEmbeddings.length === 0) {
          self.postMessage({
            type: 'ERROR',
            data: { error: 'Embeddings not generated yet', requestId },
          });
          break;
        }

        const queryOutput = await model(query, {
          pooling: 'mean',
          normalize: true,
        });

        // Calculate similarities using cached embeddings
        const scores = cachedEmbeddings.map((item: any) => ({
          id: item.id,
          similarity: cos_sim(queryOutput.data, item.embedding),
        }));

        // Sort and return top K
        const results = scores
          .sort((a: any, b: any) => b.similarity - a.similarity)
          .slice(0, topK)
          .map((item: any) => item.id);

        self.postMessage({
          type: 'SEARCH_RESULTS',
          data: { results, requestId },
        });
        break;
      }

      case 'HEALTH_CHECK': {
        // Check if model is loaded
        self.postMessage({
          type: 'HEALTH_CHECK_RESPONSE',
          data: { ready: !!embedder },
        });
        break;
      }
    }
  } catch (error: any) {
    self.postMessage({
      type: 'ERROR',
      data: { error: error.message, requestId: data?.requestId },
    });
  }
};
