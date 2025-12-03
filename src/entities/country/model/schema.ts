import { z } from 'zod';

// Enum schemas
export const SafetyLevelSchema = z.enum(['low', 'medium', 'high']);
export const ClimateTypeSchema = z.enum([
  'continental',
  'tropical',
  'subtropical',
  'oceanic',
  'arid',
  'polar',
]);
export const ImmigrationDifficultySchema = z.enum(['easy', 'medium', 'hard']);
export const EnglishLevelSchema = z.enum(['low', 'medium', 'high']);
export const HealthcareLevelSchema = z.enum(['basic', 'medium', 'advanced']);
export const BankingLevelSchema = z.enum(['weak', 'medium', 'strong']);

// LocalizedName schema
export const LocalizedNameSchema = z.object({
  ru: z.string(),
  en: z.string(),
});

// Country schema
export const CountrySchema = z.object({
  id: z.string(),
  name: LocalizedNameSchema,
  flag: z.string(),
  population: z.number().nullable(),
  language: z.string(),
  currency: z.string(),
  visa: z.string(),
  costOfLiving: z.number().nullable(),
  safety: SafetyLevelSchema.nullable(),
  internetSpeed: z.number().nullable(),
  climate: ClimateTypeSchema.nullable(),
  salary: z.number().nullable(),
  rent: z.number().nullable(),
  groceries: z.number().nullable(),
  immigrationDifficulty: ImmigrationDifficultySchema,
  taxes: z.number().nullable(),
  freelanceFriendly: z.boolean(),
  englishLevel: EnglishLevelSchema,
  healthcare: HealthcareLevelSchema,
  transport: z.number().nullable(),
  nomadVisa: z.boolean(),
  banking: BankingLevelSchema,
  russianCommunity: z.boolean(),
});

// RestCountryResponse schema (для валидации API ответов)
export const RestCountryResponseSchema = z.object({
  name: z.object({
    common: z.string(),
    official: z.string(),
    nativeName: z
      .record(
        z.string(),
        z.object({
          official: z.string(),
          common: z.string(),
        })
      )
      .optional(),
  }),
  flags: z
    .object({
      png: z.string().optional(),
      svg: z.string().optional(),
      alt: z.string().optional(),
    })
    .optional(),
  flag: z.string().optional(),
  population: z.number(),
  currencies: z
    .record(
      z.string(),
      z.object({
        name: z.string(),
        symbol: z.string(),
      })
    )
    .optional(),
  languages: z.record(z.string(), z.string()).optional(),
  cca2: z.string().optional(),
  cca3: z.string().optional(),
});

// ExternalCostOfLiving schema
export const ExternalCostOfLivingSchema = z.object({
  id: z.string(),
  costOfLiving: z.number().optional(),
  rent: z.number().optional(),
  groceries: z.number().optional(),
  transport: z.number().optional(),
  safety: SafetyLevelSchema.optional(),
  healthcare: HealthcareLevelSchema.optional(),
  internetSpeed: z.number().optional(),
  salary: z.number().optional(),
});
