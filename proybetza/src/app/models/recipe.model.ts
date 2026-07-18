export type Category = 'dulce' | 'salada' | 'agridulce' | 'postre' | 'bebida';
export type Difficulty = 'facil' | 'media' | 'dificil';

export interface RecipeStep {
  stepNumber: number;
  description: string;
}

/** DTO que devuelve el backend */
export interface Recipe {
  id: number;
  title: string;
  imageUrl: string;   // antes: image
  hasImage: boolean;
  category: Category;
  difficulty: Difficulty;
  cookTime: string;   // antes: cookTime
  description: string;
  ingredients: string[];
  steps: RecipeStep[];
}
