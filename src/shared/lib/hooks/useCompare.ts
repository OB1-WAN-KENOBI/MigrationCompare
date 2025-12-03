import { useSyncExternalStore, useCallback } from 'react';
import { compareStore } from '@shared/lib/stores/compareStore';
import { MAX_COMPARE_ITEMS } from '@shared/config';

export const useCompare = () => {
  const compareList = useSyncExternalStore(
    compareStore.subscribe,
    compareStore.getSnapshot,
    compareStore.getServerSnapshot
  );

  const addToCompare = useCallback((id: string) => {
    compareStore.addToCompare(id);
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    compareStore.removeFromCompare(id);
  }, []);

  const isInCompare = useCallback(
    (id: string) => {
      return compareList.includes(id);
    },
    [compareList]
  );

  const toggleCompare = useCallback((id: string) => {
    compareStore.toggleCompare(id);
  }, []);

  const clearCompare = useCallback(() => {
    compareStore.clearCompare();
  }, []);

  return {
    compareList,
    addToCompare,
    removeFromCompare,
    isInCompare,
    toggleCompare,
    clearCompare,
    canAddMore: compareList.length < MAX_COMPARE_ITEMS,
    compareCount: compareList.length,
  };
};
