import type { Difficulty, Category } from './recipe.model';

export interface UserPreferences {
  favoriteIngredients: string[];
  allergens: string[];
  intolerances: string[];
  preferredCategories: Category[];
  preferredDifficulty: Difficulty | null;
  updatedAt?: string;
}
