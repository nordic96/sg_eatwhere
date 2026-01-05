// src/hooks/useSemanticSearch.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { getSemanticSearchClient, SemanticSearchClient } from '@/lib/semanticSearch';
import { FoodHeritage } from '@/app/types';
import { prepareSearchData, SearchableData } from '../utils/searchUtils';

export function useSemanticSearch(foodData: FoodHeritage[]) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Use ref to track initialization state across re-renders
  const initializationRef = useRef<{
    client: SemanticSearchClient | null;
    initialized: boolean;
    initializing: boolean;
    aborted: boolean;
  }>({
    client: null,
    initialized: false,
    initializing: false,
    aborted: false,
  });

  // Get or create the search client
  const getClient = useCallback(() => {
    if (!initializationRef.current.client) {
      initializationRef.current.client = getSemanticSearchClient();
    }
    return initializationRef.current.client;
  }, []);

  // Initialize embeddings on mount
  useEffect(() => {
    // Capture ref for cleanup function
    const initState = initializationRef.current;

    // Reset aborted flag on mount - this handles React Strict Mode
    // where cleanup runs between mount cycles but the ref persists
    initState.aborted = false;

    // Skip if already initialized or currently initializing
    if (initState.initialized || initState.initializing) {
      // If already initialized, just update the state
      if (initState.initialized) {
        setIsInitializing(false);
      }
      return;
    }

    async function init() {
      const client = getClient();

      // Check if client is already ready (e.g., from previous mount)
      if (client.getReadyState()) {
        console.log('Semantic search already initialized');
        initState.initialized = true;
        setIsInitializing(false);
        return;
      }

      initState.initializing = true;

      try {
        console.log('Preparing Searchable data...');
        let searchableData: SearchableData[] = foodData;

        try {
          searchableData = await prepareSearchData(foodData);
        } catch (e) {
          console.error('Error while fetching descriptions for searchable data:', e);
        }
        console.log(initState);
        // Check if unmounted during async operation
        if (initState.aborted) {
          return;
        }

        console.log('Generating embeddings for', foodData.length, 'items...');
        await client.generateEmbeddings(searchableData);

        // Check if unmounted during async operation
        if (initState.aborted) {
          return;
        }

        console.log('Semantic search ready!');
        initState.initialized = true;
      } catch (error) {
        console.error('Failed to initialize semantic search:', error);
      } finally {
        initState.initializing = false;
        if (!initState.aborted) {
          setIsInitializing(false);
        }
      }
    }

    if (foodData.length > 0) {
      init();
    }

    // Cleanup on unmount - mark as aborted but DON'T destroy the client
    // The client is a singleton and may be reused
    return () => {
      initState.aborted = true;
    };
  }, [foodData, getClient]);

  const search = useCallback(
    async (query: string, topK: number = 10): Promise<string[]> => {
      if (!query.trim() || isInitializing) {
        return [];
      }

      const client = getClient();

      setIsSearching(true);
      try {
        const foodIds = await client.search(query, topK);
        return foodIds;
      } catch (error) {
        console.error('Search error:', error);
        return [];
      } finally {
        setIsSearching(false);
      }
    },
    [getClient, isInitializing],
  );

  return {
    search,
    isInitializing,
    isSearching,
    isReady: !isInitializing,
  };
}
