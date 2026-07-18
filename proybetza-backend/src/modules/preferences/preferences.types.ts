import { Difficulty } from '../recipes/recipes.types';

export interface DbUserPreferences {
  id: number;
  user_id: number;
  favorite_ingredients: string[];
  allergens: string[];
  intolerances: string[];
  preferred_categories: string[];
  preferred_difficulty: Difficulty | null;
  updated_at: Date;
}

export interface PreferencesDTO {
  favoriteIngredients: string[];
  allergens: string[];
  intolerances: string[];
  preferredCategories: string[];
  preferredDifficulty: string | null;
  updatedAt: Date;
}
