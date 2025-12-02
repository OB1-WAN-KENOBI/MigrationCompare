import { describe, it, expect } from 'vitest';
import type { Country, SafetyLevel, ClimateType, EnglishLevel } from '../../src/shared/types';

// Test data
const mockCountries: Country[] = [
  {
    id: 'armenia',
    name: { ru: 'Армения', en: 'Armenia' },
    flag: '🇦🇲',
    population: 2963000,
    language: 'Армянский',
    currency: 'AMD',
    visa: 'Без визы',
    costOfLiving: 750,
    safety: 'medium',
    internetSpeed: 45,
    climate: 'continental',
    salary: 617,
    rent: 250,
    groceries: 220,
    immigrationDifficulty: 'easy',
    taxes: 20,
    freelanceFriendly: true,
    englishLevel: 'low',
    healthcare: 'basic',
    transport: 45,
    nomadVisa: false,
    banking: 'Средний',
    russianCommunity: true,
  },
  {
    id: 'portugal',
    name: { ru: 'Португалия', en: 'Portugal' },
    flag: '🇵🇹',
    population: 10270000,
    language: 'Португальский',
    currency: 'EUR',
    visa: 'Шенген',
    costOfLiving: 1100,
    safety: 'high',
    internetSpeed: 80,
    climate: 'mediterranean',
    salary: 1198,
    rent: 700,
    groceries: 350,
    immigrationDifficulty: 'hard',
    taxes: 28,
    freelanceFriendly: true,
    englishLevel: 'medium',
    healthcare: 'good',
    transport: 40,
    nomadVisa: true,
    banking: 'Развитая',
    russianCommunity: false,
  },
  {
    id: 'thailand',
    name: { ru: 'Таиланд', en: 'Thailand' },
    flag: '🇹🇭',
    population: 71801000,
    language: 'Тайский',
    currency: 'THB',
    visa: 'Без визы 60 дней',
    costOfLiving: 700,
    safety: 'medium',
    internetSpeed: 55,
    climate: 'tropical',
    salary: 664,
    rent: 250,
    groceries: 200,
    immigrationDifficulty: 'medium',
    taxes: 35,
    freelanceFriendly: false,
    englishLevel: 'low',
    healthcare: 'medium',
    transport: 21,
    nomadVisa: false,
    banking: 'Средняя',
    russianCommunity: false,
  },
];

// Filter functions (testing pure logic)
const filterBySafety = (countries: Country[], safetyLevels: SafetyLevel[]): Country[] => {
  if (safetyLevels.length === 0) return countries;
  return countries.filter((c) => safetyLevels.includes(c.safety as SafetyLevel));
};

const filterByClimate = (countries: Country[], climates: ClimateType[]): Country[] => {
  if (climates.length === 0) return countries;
  return countries.filter((c) => climates.includes(c.climate as ClimateType));
};

const filterByEnglishLevel = (countries: Country[], levels: EnglishLevel[]): Country[] => {
  if (levels.length === 0) return countries;
  return countries.filter((c) => levels.includes(c.englishLevel as EnglishLevel));
};

const filterByRentRange = (countries: Country[], range: [number, number]): Country[] => {
  return countries.filter((c) => c.rent >= range[0] && c.rent <= range[1]);
};

const filterByTaxesRange = (countries: Country[], range: [number, number]): Country[] => {
  return countries.filter((c) => c.taxes >= range[0] && c.taxes <= range[1]);
};

const filterBySearch = (countries: Country[], query: string): Country[] => {
  if (!query) return countries;
  const lowerQuery = query.toLowerCase();
  return countries.filter(
    (c) =>
      c.name.ru.toLowerCase().includes(lowerQuery) || c.name.en.toLowerCase().includes(lowerQuery)
  );
};

// Sort functions
const SAFETY_ORDER: Record<string, number> = { low: 1, medium: 2, high: 3 };
const IMMIGRATION_ORDER: Record<string, number> = { easy: 1, medium: 2, hard: 3 };

const sortByRent = (countries: Country[], direction: 'asc' | 'desc'): Country[] => {
  return [...countries].sort((a, b) => (direction === 'asc' ? a.rent - b.rent : b.rent - a.rent));
};

const sortBySafety = (countries: Country[], direction: 'asc' | 'desc'): Country[] => {
  return [...countries].sort((a, b) => {
    const diff = (SAFETY_ORDER[a.safety] ?? 0) - (SAFETY_ORDER[b.safety] ?? 0);
    return direction === 'asc' ? diff : -diff;
  });
};

const sortBySalary = (countries: Country[], direction: 'asc' | 'desc'): Country[] => {
  return [...countries].sort((a, b) =>
    direction === 'asc' ? a.salary - b.salary : b.salary - a.salary
  );
};

const sortByImmigrationDifficulty = (
  countries: Country[],
  direction: 'asc' | 'desc'
): Country[] => {
  return [...countries].sort((a, b) => {
    const diff =
      (IMMIGRATION_ORDER[a.immigrationDifficulty] ?? 0) -
      (IMMIGRATION_ORDER[b.immigrationDifficulty] ?? 0);
    return direction === 'asc' ? diff : -diff;
  });
};

describe('Filter Functions', () => {
  describe('filterBySafety', () => {
    it('should return all countries when no safety filter applied', () => {
      const result = filterBySafety(mockCountries, []);
      expect(result).toHaveLength(3);
    });

    it('should filter by high safety', () => {
      const result = filterBySafety(mockCountries, ['high']);
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('portugal');
    });

    it('should filter by multiple safety levels', () => {
      const result = filterBySafety(mockCountries, ['medium', 'high']);
      expect(result).toHaveLength(3);
    });
  });

  describe('filterByClimate', () => {
    it('should return all countries when no climate filter applied', () => {
      const result = filterByClimate(mockCountries, []);
      expect(result).toHaveLength(3);
    });

    it('should filter by tropical climate', () => {
      const result = filterByClimate(mockCountries, ['tropical']);
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('thailand');
    });

    it('should filter by multiple climates', () => {
      const result = filterByClimate(mockCountries, ['continental', 'mediterranean']);
      expect(result).toHaveLength(2);
    });
  });

  describe('filterByEnglishLevel', () => {
    it('should return all countries when no english filter applied', () => {
      const result = filterByEnglishLevel(mockCountries, []);
      expect(result).toHaveLength(3);
    });

    it('should filter by low english level', () => {
      const result = filterByEnglishLevel(mockCountries, ['low']);
      expect(result).toHaveLength(2);
    });
  });

  describe('filterByRentRange', () => {
    it('should filter by rent range', () => {
      const result = filterByRentRange(mockCountries, [200, 300]);
      expect(result).toHaveLength(2);
    });

    it('should return empty when no countries match range', () => {
      const result = filterByRentRange(mockCountries, [1000, 2000]);
      expect(result).toHaveLength(0);
    });
  });

  describe('filterByTaxesRange', () => {
    it('should filter by taxes range', () => {
      const result = filterByTaxesRange(mockCountries, [15, 25]);
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('armenia');
    });
  });

  describe('filterBySearch', () => {
    it('should return all countries when search is empty', () => {
      const result = filterBySearch(mockCountries, '');
      expect(result).toHaveLength(3);
    });

    it('should find country by russian name', () => {
      const result = filterBySearch(mockCountries, 'Армения');
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('armenia');
    });

    it('should find country by english name', () => {
      const result = filterBySearch(mockCountries, 'Portugal');
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('portugal');
    });

    it('should be case insensitive', () => {
      const result = filterBySearch(mockCountries, 'THAILAND');
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('thailand');
    });
  });
});

describe('Sort Functions', () => {
  describe('sortByRent', () => {
    it('should sort by rent ascending', () => {
      const result = sortByRent(mockCountries, 'asc');
      expect(result[0]?.id).toBe('armenia');
      expect(result[2]?.id).toBe('portugal');
    });

    it('should sort by rent descending', () => {
      const result = sortByRent(mockCountries, 'desc');
      expect(result[0]?.id).toBe('portugal');
      expect(result[2]?.rent).toBe(250);
    });
  });

  describe('sortBySafety', () => {
    it('should sort by safety ascending (low first)', () => {
      const result = sortBySafety(mockCountries, 'asc');
      expect(result[0]?.safety).toBe('medium');
      expect(result[2]?.safety).toBe('high');
    });

    it('should sort by safety descending (high first)', () => {
      const result = sortBySafety(mockCountries, 'desc');
      expect(result[0]?.safety).toBe('high');
    });
  });

  describe('sortBySalary', () => {
    it('should sort by salary ascending', () => {
      const result = sortBySalary(mockCountries, 'asc');
      expect(result[0]?.id).toBe('armenia');
      expect(result[2]?.id).toBe('portugal');
    });

    it('should sort by salary descending', () => {
      const result = sortBySalary(mockCountries, 'desc');
      expect(result[0]?.id).toBe('portugal');
    });
  });

  describe('sortByImmigrationDifficulty', () => {
    it('should sort by immigration difficulty ascending (easy first)', () => {
      const result = sortByImmigrationDifficulty(mockCountries, 'asc');
      expect(result[0]?.immigrationDifficulty).toBe('easy');
      expect(result[2]?.immigrationDifficulty).toBe('hard');
    });

    it('should sort by immigration difficulty descending (hard first)', () => {
      const result = sortByImmigrationDifficulty(mockCountries, 'desc');
      expect(result[0]?.immigrationDifficulty).toBe('hard');
    });
  });
});
