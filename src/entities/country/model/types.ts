export type SafetyLevel = 'low' | 'medium' | 'high';
export type ClimateType = 'continental' | 'tropical' | 'subtropical' | 'oceanic' | 'arid' | 'polar';
export type ImmigrationDifficulty = 'easy' | 'medium' | 'hard';
export type EnglishLevel = 'low' | 'medium' | 'high';
export type HealthcareLevel = 'basic' | 'medium' | 'advanced';
export type BankingLevel = 'weak' | 'medium' | 'strong';

export interface LocalizedName {
  ru: string;
  en: string;
}

export interface Country {
  id: string; // slug, например "armenia"
  name: LocalizedName;
  flag: string; // emoji или URL
  population: number | null;

  language: string; // человекочитаемая строка, например "Армянский, Русский"
  currency: string; // "AMD"
  visa: string; // "Без визы до 180 дней"

  costOfLiving: number | null; // USD/мес для одного человека или агрегированный индекс
  safety: SafetyLevel | null;
  internetSpeed: number | null; // Mbps (fixed broadband)
  climate: ClimateType | null;

  salary: number | null; // средняя нетто-зарплата, USD/мес
  rent: number | null; // аренда 1-комн квартиры в столице, USD/мес
  groceries: number | null; // расходы на продукты, USD/мес

  immigrationDifficulty: ImmigrationDifficulty;
  taxes: number | null; // ставка подоходного налога, %
  freelanceFriendly: boolean;
  englishLevel: EnglishLevel;
  healthcare: HealthcareLevel;
  transport: number | null; // траты на транспорт, USD/мес
  nomadVisa: boolean;
  banking: BankingLevel;
  russianCommunity: boolean;
}
