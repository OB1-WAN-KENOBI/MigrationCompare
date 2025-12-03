import { STORAGE_KEYS, MAX_COMPARE_ITEMS } from '@shared/config';

type Listener = () => void;

const listeners = new Set<Listener>();

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

const getStoredList = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMPARE_LIST);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return isStringArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

let compareList = getStoredList();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEYS.COMPARE_LIST, JSON.stringify(compareList));
};

export const compareStore = {
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot: () => compareList,

  getServerSnapshot: () => [] as string[],

  addToCompare: (id: string) => {
    if (compareList.includes(id) || compareList.length >= MAX_COMPARE_ITEMS) {
      return;
    }
    compareList = [...compareList, id];
    saveToStorage();
    notifyListeners();
  },

  removeFromCompare: (id: string) => {
    compareList = compareList.filter((item) => item !== id);
    saveToStorage();
    notifyListeners();
  },

  toggleCompare: (id: string) => {
    if (compareList.includes(id)) {
      compareStore.removeFromCompare(id);
    } else {
      compareStore.addToCompare(id);
    }
  },

  clearCompare: () => {
    compareList = [];
    saveToStorage();
    notifyListeners();
  },

  isInCompare: (id: string) => compareList.includes(id),

  canAddMore: () => compareList.length < MAX_COMPARE_ITEMS,

  getCount: () => compareList.length,
};
