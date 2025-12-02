import { STORAGE_KEYS } from '@shared/config';

const MAX_COMPARE_ITEMS = 5;

type Listener = () => void;

const listeners = new Set<Listener>();

const getStoredList = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMPARE_LIST);
    return stored ? (JSON.parse(stored) as string[]) : [];
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
