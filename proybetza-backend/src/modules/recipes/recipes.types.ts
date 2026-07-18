export type Category = 'dulce' | 'salada' | 'agridulce' | 'postre' | 'bebida';
export type Difficulty = 'facil' | 'media' | 'dificil';

export interface DbRecipe {
  id: number;
  title: string;
  category: Category;
  difficulty: Difficulty;
  cook_time: string;
  description: string;
  image_data: Buffer | null;
  image_mime: string | null;
  image_filename: string | null;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface DbIngredient {
  id: number;
  recipe_id: number;
  name: string;
  order_index: number;
}

export interface DbStep {
  id: number;
  recipe_id: number;
  step_number: number;
  description: string;
}

export interface RecipeDTO {
  id: number;
  title: string;
  category: Category;
  difficulty: Difficulty;
  cookTime: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  steps: { stepNumber: number; description: string }[];
  hasImage: boolean;
}

export interface RecipeRow extends DbRecipe {
  ingredients: string[];
  steps: { step_number: number; description: string }[];
}

export const INTOLERANCES_MAP: Record<string, string[]> = {
  'Intolerancia a la Lactosa': [
    'leche', 'crema', 'queso', 'mantequilla', 'mascarpone', 'yogur', 'evaporada', 'condensada'
  ],
  'Intolerancia al Gluten': [
    'harina', 'trigo', 'avena', 'centeno', 'pan', 'galleta', 'galletas', 'bizcotela', 'bizcotelas'
  ],
  'Alergia a los Mariscos': [
    'camarón', 'camarones', 'mejillón', 'mejillones', 'mariscos', 'langostinos', 'pescado', 'salmón'
  ],
  'Alergia a los Frutos Secos': [
    'nuez', 'nueces', 'almendra', 'almendras', 'maní', 'cacahuate', 'cacahuates', 'avellana', 'avellanas'
  ],
  'Alergia al Huevo': [
    'huevo', 'huevos', 'clara', 'claras', 'yema', 'yemas'
  ]
};

export function cleanIngredientName(name: string): string {
  let clean = name.toLowerCase().trim();

  // 1. Quitar números (incluyendo fracciones como 1/2, 1/4, 3/4)
  clean = clean.replace(/\b\d+(\/\d+)?\b/g, ''); // quita números sueltos y fracciones
  clean = clean.replace(/\b\d+\b/g, ''); // quita cualquier número
  
  // 2. Quitar medidas comunes y preposiciones
  const unitsAndStopWords = [
    'cdita', 'cditas', 'cda', 'cdas', 'taza', 'tazas', 'lata', 'latas', 'kg', 'gr', 'g', 'ml', 'litro', 'litros', 'oz', 'rama', 'ramas', 'vaina', 'vainas', 'trozo', 'trozos', 'diente', 'dientes', 'pechuga', 'pechugas', 'lomo', 'alitas', 'bisteces', 'paquete', 'paquetes', 'rebanada', 'rebanadas', 'hoja', 'hojas', 'pizca', 'pizcas', 'bote', 'botes', 'taza de', 'tazas de', 'lata de', 'latas de', 'cdita de', 'cditas de', 'cda de', 'cdas de', 'rama de', 'ramas de', 'vaina de', 'vainas de', 'trozo de', 'trozos de', 'diente de', 'dientes de', 'pechuga de', 'pechugas de', 'lomo de', 'alitas de', 'bisteces de', 'paquete de', 'paquetes de', 'rebanada de', 'rebanadas de', 'hoja de', 'hojas de', 'pizca de', 'pizcas de', 'bote de', 'botes de', 'de', 'del', 'para'
  ];

  // Ordenar de mayor a menor longitud para que reemplace frases más largas primero
  const sortedWords = [...unitsAndStopWords].sort((a, b) => b.length - a.length);

  for (const word of sortedWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    clean = clean.replace(regex, '');
  }

  // 3. Quitar puntuación y espacios extras
  clean = clean.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  clean = clean.replace(/\s+/g, ' ').trim();

  return clean;
}
