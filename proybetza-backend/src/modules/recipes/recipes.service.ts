import { pool, withTransaction } from '../../config/database';
import { AppError } from '../../errors/app-error';
import { PaginatedResponse } from '../../types';
import { Category, DbRecipe, RecipeDTO, RecipeRow, cleanIngredientName, INTOLERANCES_MAP } from './recipes.types';
import { CreateRecipeDto, UpdateRecipeDto } from './recipes.schemas';

export class RecipesService {
  /** Lista recetas con paginación y filtros opcionales */
  async list(params: {
    page: number;
    limit: number;
    category?: string;
    difficulty?: string;
  }): Promise<PaginatedResponse<RecipeDTO>> {
    const { page, limit, category, difficulty } = params;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: unknown[] = [];
    let paramIdx = 1;

    if (category) {
      conditions.push(`r.category = $${paramIdx++}`);
      values.push(category);
    }
    if (difficulty) {
      conditions.push(`r.difficulty = $${paramIdx++}`);
      values.push(difficulty);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM recipes r ${where}`;
    const { rows: countRows } = await pool.query(countQuery, values);
    const total = parseInt(countRows[0].count, 10);

    values.push(limit, offset);
    const dataQuery = `
      SELECT
        r.id, r.title, r.category, r.difficulty, r.cook_time, r.description,
        r.image_url, r.image_mime,
        CASE WHEN r.image_data IS NOT NULL THEN true ELSE false END AS has_image,
        (
          SELECT COALESCE(json_agg(json_build_object('name', ri.name, 'order_index', ri.order_index) ORDER BY ri.order_index), '[]')
          FROM recipe_ingredients ri
          WHERE ri.recipe_id = r.id
        ) AS ingredients_raw,
        (
          SELECT COALESCE(json_agg(json_build_object('step_number', rs.step_number, 'description', rs.description) ORDER BY rs.step_number), '[]')
          FROM recipe_steps rs
          WHERE rs.recipe_id = r.id
        ) AS steps_raw
      FROM recipes r
      ${where}
      ORDER BY r.created_at DESC
      LIMIT $${paramIdx++} OFFSET $${paramIdx++}
    `;

    const { rows } = await pool.query(dataQuery, values);

    return {
      data: rows.map(this.rowToDTO.bind(this)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /** Obtiene una receta por ID con todos sus detalles */
  async getById(id: number): Promise<RecipeDTO> {
    const { rows } = await pool.query(
      `SELECT
        r.id, r.title, r.category, r.difficulty, r.cook_time, r.description,
        r.image_url, r.image_mime,
        CASE WHEN r.image_data IS NOT NULL THEN true ELSE false END AS has_image,
        (
          SELECT COALESCE(json_agg(json_build_object('name', ri.name, 'order_index', ri.order_index) ORDER BY ri.order_index), '[]')
          FROM recipe_ingredients ri
          WHERE ri.recipe_id = r.id
        ) AS ingredients_raw,
        (
          SELECT COALESCE(json_agg(json_build_object('step_number', rs.step_number, 'description', rs.description) ORDER BY rs.step_number), '[]')
          FROM recipe_steps rs
          WHERE rs.recipe_id = r.id
        ) AS steps_raw
      FROM recipes r
      WHERE r.id = $1`,
      [id]
    );

    if (!rows[0]) throw new AppError('Receta no encontrada', 404, 'RECIPE_NOT_FOUND');
    return this.rowToDTO(rows[0]);
  }

  /** Sirve la imagen binaria de una receta */
  async getImage(id: number): Promise<{ data: Buffer; mime: string; filename: string }> {
    const { rows } = await pool.query(
      'SELECT image_data, image_mime, image_filename FROM recipes WHERE id = $1',
      [id]
    );
    if (!rows[0] || !rows[0].image_data) {
      throw new AppError('Imagen no encontrada', 404, 'IMAGE_NOT_FOUND');
    }
    return {
      data: rows[0].image_data,
      mime: rows[0].image_mime || 'image/jpeg',
      filename: rows[0].image_filename || `recipe-${id}`,
    };
  }

  /** Busca recetas por título o ingrediente */
  async search(query: string, page: number, limit: number): Promise<PaginatedResponse<RecipeDTO>> {
    const q = `%${query.toLowerCase()}%`;
    const offset = (page - 1) * limit;

    const countQ = `
      SELECT COUNT(DISTINCT r.id)
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON ri.recipe_id = r.id
      WHERE LOWER(r.title) LIKE $1 OR LOWER(ri.name) LIKE $1
    `;
    const { rows: countRows } = await pool.query(countQ, [q]);
    const total = parseInt(countRows[0].count, 10);

    const { rows } = await pool.query(
      `SELECT
        r.id, r.title, r.category, r.difficulty, r.cook_time, r.description,
        r.image_url, r.image_mime,
        CASE WHEN r.image_data IS NOT NULL THEN true ELSE false END AS has_image,
        (
          SELECT COALESCE(json_agg(json_build_object('name', ri.name, 'order_index', ri.order_index) ORDER BY ri.order_index), '[]')
          FROM recipe_ingredients ri
          WHERE ri.recipe_id = r.id
        ) AS ingredients_raw,
        (
          SELECT COALESCE(json_agg(json_build_object('step_number', rs.step_number, 'description', rs.description) ORDER BY rs.step_number), '[]')
          FROM recipe_steps rs
          WHERE rs.recipe_id = r.id
        ) AS steps_raw
      FROM recipes r
      WHERE r.id IN (
        SELECT DISTINCT r2.id FROM recipes r2
        LEFT JOIN recipe_ingredients ri2 ON ri2.recipe_id = r2.id
        WHERE LOWER(r2.title) LIKE $1 OR LOWER(ri2.name) LIKE $1
      )
      ORDER BY r.title
      LIMIT $2 OFFSET $3`,
      [q, limit, offset]
    );

    return {
      data: rows.map(this.rowToDTO.bind(this)),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /** Recetas recomendadas según preferencias del usuario */
  async getRecommended(userId: number): Promise<RecipeDTO[]> {
    const { rows: prefRows } = await pool.query<{ favorite_ingredients: string[]; allergens: string[]; intolerances: string[] }>(
      'SELECT favorite_ingredients, allergens, intolerances FROM user_preferences WHERE user_id = $1',
      [userId]
    );

    const prefs = prefRows[0] || { favorite_ingredients: [], allergens: [], intolerances: [] };
    const { favorite_ingredients: favs, allergens, intolerances } = prefs;

    // Obtener todas las recetas
    const { rows } = await pool.query(
      `SELECT
        r.id, r.title, r.category, r.difficulty, r.cook_time, r.description,
        r.image_url, r.image_mime,
        CASE WHEN r.image_data IS NOT NULL THEN true ELSE false END AS has_image,
        (
          SELECT COALESCE(json_agg(json_build_object('name', ri.name, 'order_index', ri.order_index) ORDER BY ri.order_index), '[]')
          FROM recipe_ingredients ri
          WHERE ri.recipe_id = r.id
        ) AS ingredients_raw,
        (
          SELECT COALESCE(json_agg(json_build_object('step_number', rs.step_number, 'description', rs.description) ORDER BY rs.step_number), '[]')
          FROM recipe_steps rs
          WHERE rs.recipe_id = r.id
        ) AS steps_raw
      FROM recipes r`
    );

    let dtos = rows.map(this.rowToDTO.bind(this));

    // Recopilar palabras clave excluidas (alérgenos específicos + intolerancias predefinidas)
    const intoleranceKeywords: string[] = [];
    if (intolerances && intolerances.length > 0) {
      for (const intolerance of intolerances) {
        const keywords = INTOLERANCES_MAP[intolerance];
        if (keywords) {
          intoleranceKeywords.push(...keywords);
        }
      }
    }

    const excludeKeywords = [
      ...allergens.map(a => a.toLowerCase().trim()),
      ...intoleranceKeywords.map(k => k.toLowerCase().trim())
    ].filter(k => k.length > 0);

    // 1. Filtrar alérgenos e intolerancias
    if (excludeKeywords.length > 0) {
      dtos = dtos.filter((recipe) => {
        const cleanedRecipeIngredients = recipe.ingredients.map(cleanIngredientName);
        const hasExcluded = cleanedRecipeIngredients.some((ri) => {
          return excludeKeywords.some((keyword) => {
            return ri.includes(keyword) || keyword.includes(ri);
          });
        });
        return !hasExcluded;
      });
    }

    // 2. Scoring y ordenación por ingredientes favoritos
    if (favs.length > 0) {
      const cleanFavs = favs.map(f => f.toLowerCase().trim());
      return dtos
        .map((r) => {
          const cleanedRecipeIngredients = r.ingredients.map(cleanIngredientName);
          const score = cleanedRecipeIngredients.filter((ri) => {
            return cleanFavs.some(fav => ri.includes(fav) || fav.includes(ri));
          }).length;
          return { recipe: r, score };
        })
        .sort((a, b) => b.score - a.score)
        .map((x) => x.recipe);
    }

    return dtos;
  }

  /** Lista todos los ingredientes únicos (para el selector de preferencias) */
  async getAllIngredients(): Promise<string[]> {
    const { rows } = await pool.query<{ name: string }>(
      `SELECT DISTINCT name FROM recipe_ingredients`
    );
    const cleaned = rows
      .map((r) => cleanIngredientName(r.name))
      .filter((name) => name.length > 0);
    return Array.from(new Set(cleaned)).sort((a, b) => a.localeCompare(b, 'es'));
  }

  /** Crea una nueva receta (solo admin) */
  async create(dto: CreateRecipeDto): Promise<RecipeDTO> {
    return withTransaction(async (client) => {
      const { rows } = await client.query(
        `INSERT INTO recipes (title, category, difficulty, cook_time, description, image_url)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [dto.title, dto.category, dto.difficulty, dto.cookTime, dto.description, dto.imageUrl ?? null]
      );
      const recipeId: number = rows[0].id;

      for (let i = 0; i < dto.ingredients.length; i++) {
        await client.query(
          'INSERT INTO recipe_ingredients (recipe_id, name, order_index) VALUES ($1, $2, $3)',
          [recipeId, dto.ingredients[i], i]
        );
      }

      for (let i = 0; i < dto.steps.length; i++) {
        await client.query(
          'INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES ($1, $2, $3)',
          [recipeId, i + 1, dto.steps[i]]
        );
      }

      return this.getById(recipeId);
    });
  }

  /** Actualiza una receta (solo admin) */
  async update(id: number, dto: UpdateRecipeDto): Promise<RecipeDTO> {
    const existing = await this.getById(id); // throws 404 si no existe

    return withTransaction(async (client) => {
      await client.query(
        `UPDATE recipes SET
          title = COALESCE($1, title),
          category = COALESCE($2, category),
          difficulty = COALESCE($3, difficulty),
          cook_time = COALESCE($4, cook_time),
          description = COALESCE($5, description),
          image_url = COALESCE($6, image_url)
        WHERE id = $7`,
        [dto.title, dto.category, dto.difficulty, dto.cookTime, dto.description, dto.imageUrl, id]
      );

      if (dto.ingredients) {
        await client.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [id]);
        for (let i = 0; i < dto.ingredients.length; i++) {
          await client.query(
            'INSERT INTO recipe_ingredients (recipe_id, name, order_index) VALUES ($1, $2, $3)',
            [id, dto.ingredients[i], i]
          );
        }
      }

      if (dto.steps) {
        await client.query('DELETE FROM recipe_steps WHERE recipe_id = $1', [id]);
        for (let i = 0; i < dto.steps.length; i++) {
          await client.query(
            'INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES ($1, $2, $3)',
            [id, i + 1, dto.steps[i]]
          );
        }
      }

      return this.getById(id);
    });
  }

  /** Sube o reemplaza la imagen de una receta */
  async uploadImage(id: number, file: Express.Multer.File): Promise<{ imageUrl: string }> {
    await this.getById(id); // throws 404

    await pool.query(
      `UPDATE recipes SET image_data = $1, image_mime = $2, image_filename = $3 WHERE id = $4`,
      [file.buffer, file.mimetype, file.originalname, id]
    );

    return { imageUrl: `/api/recipes/${id}/image` };
  }

  /** Elimina una receta (solo admin) */
  async delete(id: number): Promise<void> {
    const { rowCount } = await pool.query('DELETE FROM recipes WHERE id = $1', [id]);
    if (!rowCount) throw new AppError('Receta no encontrada', 404, 'RECIPE_NOT_FOUND');
  }

  /** Convierte fila de DB a DTO */
  private rowToDTO(row: Record<string, unknown>): RecipeDTO {
    const hasImage = Boolean(row.has_image);
    const ingredientsRaw = (row.ingredients_raw as { name: string; order_index: number }[]) || [];
    const stepsRaw = (row.steps_raw as { step_number: number; description: string }[]) || [];

    return {
      id: row.id as number,
      title: row.title as string,
      category: row.category as Category,
      difficulty: row.difficulty as 'facil' | 'media' | 'dificil',
      cookTime: row.cook_time as string,
      description: row.description as string,
      imageUrl: hasImage
        ? `/api/recipes/${row.id}/image`
        : (row.image_url as string) || '',
      hasImage,
      ingredients: ingredientsRaw
        .sort((a, b) => a.order_index - b.order_index)
        .map((i) => i.name),
      steps: stepsRaw
        .sort((a, b) => a.step_number - b.step_number)
        .map((s) => ({ stepNumber: s.step_number, description: s.description })),
    };
  }
}

export const recipesService = new RecipesService();
