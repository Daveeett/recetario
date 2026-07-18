import { z } from 'zod';

const CATEGORIES = ['dulce', 'salada', 'agridulce', 'postre', 'bebida'] as const;
const DIFFICULTIES = ['facil', 'media', 'dificil'] as const;

export const updatePreferencesSchema = z.object({
  favoriteIngredients: z.array(z.string().min(1).max(200)).optional(),
  allergens: z.array(z.string().min(1).max(200)).optional(),
  intolerances: z.array(z.string().min(1).max(200)).optional(),
  preferredCategories: z.array(z.enum(CATEGORIES)).optional(),
  preferredDifficulty: z.enum(DIFFICULTIES).nullable().optional(),
});

export const toggleIngredientSchema = z.object({
  ingredient: z.string().min(1, 'El ingrediente es requerido').max(200),
});

export const toggleIntoleranceSchema = z.object({
  intolerance: z.string().min(1, 'La intolerancia es requerida').max(200),
});

export type UpdatePreferencesDto = z.infer<typeof updatePreferencesSchema>;
export type ToggleIngredientDto = z.infer<typeof toggleIngredientSchema>;
export type ToggleIntoleranceDto = z.infer<typeof toggleIntoleranceSchema>;
