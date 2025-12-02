import { describe, it, expect, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

// Simple compare store implementation for testing
const createCompareStore = () => {
  let list: string[] = [];
  const listeners = new Set<() => void>();

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('migration_compare');
      if (stored) {
        list = JSON.parse(stored) as string[];
      }
    } catch {
      list = [];
    }
  };

  const saveToStorage = () => {
    localStorage.setItem('migration_compare', JSON.stringify(list));
    listeners.forEach((listener) => listener());
  };

  return {
    getList: () => list,
    addToCompare: (id: string) => {
      if (!list.includes(id) && list.length < 5) {
        list = [...list, id];
        saveToStorage();
      }
    },
    removeFromCompare: (id: string) => {
      list = list.filter((item) => item !== id);
      saveToStorage();
    },
    clearCompare: () => {
      list = [];
      saveToStorage();
    },
    isInCompare: (id: string) => list.includes(id),
    canAddMore: () => list.length < 5,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    init: () => loadFromStorage(),
  };
};

// Simple favorites store implementation for testing
const createFavoritesStore = () => {
  let favorites: string[] = [];

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('migration_favorites');
      if (stored) {
        favorites = JSON.parse(stored) as string[];
      }
    } catch {
      favorites = [];
    }
  };

  const saveToStorage = () => {
    localStorage.setItem('migration_favorites', JSON.stringify(favorites));
  };

  return {
    getFavorites: () => favorites,
    addToFavorites: (id: string) => {
      if (!favorites.includes(id)) {
        favorites = [...favorites, id];
        saveToStorage();
      }
    },
    removeFromFavorites: (id: string) => {
      favorites = favorites.filter((item) => item !== id);
      saveToStorage();
    },
    isFavorite: (id: string) => favorites.includes(id),
    clearFavorites: () => {
      favorites = [];
      saveToStorage();
    },
    init: () => loadFromStorage(),
  };
};

describe('Compare Store', () => {
  let store: ReturnType<typeof createCompareStore>;

  beforeEach(() => {
    localStorageMock.clear();
    store = createCompareStore();
    store.init();
  });

  it('should start with empty list', () => {
    expect(store.getList()).toEqual([]);
  });

  it('should add country to compare', () => {
    store.addToCompare('armenia');
    expect(store.getList()).toContain('armenia');
    expect(store.isInCompare('armenia')).toBe(true);
  });

  it('should not add duplicate countries', () => {
    store.addToCompare('armenia');
    store.addToCompare('armenia');
    expect(store.getList()).toHaveLength(1);
  });

  it('should limit compare list to 5 countries', () => {
    store.addToCompare('country1');
    store.addToCompare('country2');
    store.addToCompare('country3');
    store.addToCompare('country4');
    store.addToCompare('country5');
    store.addToCompare('country6');
    expect(store.getList()).toHaveLength(5);
    expect(store.canAddMore()).toBe(false);
  });

  it('should remove country from compare', () => {
    store.addToCompare('armenia');
    store.removeFromCompare('armenia');
    expect(store.getList()).not.toContain('armenia');
    expect(store.isInCompare('armenia')).toBe(false);
  });

  it('should clear all countries from compare', () => {
    store.addToCompare('armenia');
    store.addToCompare('portugal');
    store.clearCompare();
    expect(store.getList()).toHaveLength(0);
  });

  it('should persist to localStorage', () => {
    store.addToCompare('armenia');
    const stored = localStorage.getItem('migration_compare');
    expect(stored).toBe('["armenia"]');
  });

  it('should load from localStorage', () => {
    localStorage.setItem('migration_compare', '["armenia","portugal"]');
    const newStore = createCompareStore();
    newStore.init();
    expect(newStore.getList()).toEqual(['armenia', 'portugal']);
  });
});

describe('Favorites Store', () => {
  let store: ReturnType<typeof createFavoritesStore>;

  beforeEach(() => {
    localStorageMock.clear();
    store = createFavoritesStore();
    store.init();
  });

  it('should start with empty favorites', () => {
    expect(store.getFavorites()).toEqual([]);
  });

  it('should add country to favorites', () => {
    store.addToFavorites('armenia');
    expect(store.getFavorites()).toContain('armenia');
    expect(store.isFavorite('armenia')).toBe(true);
  });

  it('should not add duplicate favorites', () => {
    store.addToFavorites('armenia');
    store.addToFavorites('armenia');
    expect(store.getFavorites()).toHaveLength(1);
  });

  it('should remove country from favorites', () => {
    store.addToFavorites('armenia');
    store.removeFromFavorites('armenia');
    expect(store.getFavorites()).not.toContain('armenia');
    expect(store.isFavorite('armenia')).toBe(false);
  });

  it('should clear all favorites', () => {
    store.addToFavorites('armenia');
    store.addToFavorites('portugal');
    store.clearFavorites();
    expect(store.getFavorites()).toHaveLength(0);
  });

  it('should persist to localStorage', () => {
    store.addToFavorites('armenia');
    const stored = localStorage.getItem('migration_favorites');
    expect(stored).toBe('["armenia"]');
  });

  it('should load from localStorage', () => {
    localStorage.setItem('migration_favorites', '["armenia","thailand"]');
    const newStore = createFavoritesStore();
    newStore.init();
    expect(newStore.getFavorites()).toEqual(['armenia', 'thailand']);
  });
});
