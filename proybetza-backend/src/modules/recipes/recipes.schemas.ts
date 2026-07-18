import { z } from 'zod';

const CATEGORIES = ['dulce', 'salada', 'agridulce', 'postre', 'bebida'] as const;
const DIFFICULTIES = ['facil', 'media', 'dificil'] as const;

export const createRecipeSchema = z.object({
  title: z.string().min(2).max(200),
  category: z.enum(CATEGORIES),
  difficulty: z.enum(DIFFICULTIES),
  cookTime: z.string().min(1).max(50),
  description: z.string().min(10).max(5000),
  imageUrl: z.string().url().optional(),
  ingredients: z
    .array(z.string().min(1).max(200))
    .min(1, 'Se requiere al menos 1 ingrediente')
    .max(50),
  steps: z
    .array(z.string().min(5).max(2000))
    .min(1, 'Se requiere al menos 1 paso')
    .max(30),
});

export const updateRecipeSchema = createRecipeSchema.partial();

export const recipeIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const categoryParamSchema = z.object({
  slug: z.enum(CATEGORIES),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: z.enum(CATEGORIES).optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
});

export type CreateRecipeDto = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeDto = z.infer<typeof updateRecipeSchema>;
