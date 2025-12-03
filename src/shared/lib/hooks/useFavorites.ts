import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@shared/config';

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return isStringArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = useCallback((id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const removeFromFavorites = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((item) => item !== id));
  }, []);

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.includes(id);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      if (isFavorite(id)) {
        removeFromFavorites(id);
      } else {
        addToFavorites(id);
      }
    },
    [isFavorite, removeFromFavorites, addToFavorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };
};
