import { pool } from '../../config/database';
import { UpdatePreferencesDto } from './preferences.schemas';
import { DbUserPreferences, PreferencesDTO } from './preferences.types';

export class PreferencesService {
  /** Obtiene las preferencias del usuario (crea registro si no existe) */
  async get(userId: number): Promise<PreferencesDTO> {
    let { rows } = await pool.query<DbUserPreferences>(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [userId]
    );

    if (!rows[0]) {
      const { rows: newRows } = await pool.query<DbUserPreferences>(
        'INSERT INTO user_preferences (user_id) VALUES ($1) RETURNING *',
        [userId]
      );
      rows = newRows;
    }

    return this.toDTO(rows[0]);
  }

  /** Actualización completa de preferencias */
  async update(userId: number, dto: UpdatePreferencesDto): Promise<PreferencesDTO> {
    const current = await this.get(userId);

    const { rows } = await pool.query<DbUserPreferences>(
      `UPDATE user_preferences SET
        favorite_ingredients  = COALESCE($1::text[], favorite_ingredients),
        allergens             = COALESCE($2::text[], allergens),
        intolerances          = COALESCE($3::text[], intolerances),
        preferred_categories  = COALESCE($4::text[], preferred_categories),
        preferred_difficulty  = $5
      WHERE user_id = $6
      RETURNING *`,
      [
        dto.favoriteIngredients ?? null,
        dto.allergens ?? null,
        dto.intolerances ?? null,
        dto.preferredCategories ?? null,
        dto.preferredDifficulty !== undefined ? dto.preferredDifficulty : current.preferredDifficulty,
        userId,
      ]
    );

    return this.toDTO(rows[0]);
  }

  /** Toggle de ingrediente favorito (añade o quita) */
  async toggleFavorite(userId: number, ingredient: string): Promise<PreferencesDTO> {
    const prefs = await this.get(userId);
    let favs = prefs.favoriteIngredients;

    if (favs.includes(ingredient)) {
      favs = favs.filter((i) => i !== ingredient);
    } else {
      favs = [...favs, ingredient];
    }

    const { rows } = await pool.query<DbUserPreferences>(
      `UPDATE user_preferences SET favorite_ingredients = $1 WHERE user_id = $2 RETURNING *`,
      [favs, userId]
    );

    return this.toDTO(rows[0]);
  }

  /** Toggle de alérgeno (añade o quita) */
  async toggleAllergen(userId: number, ingredient: string): Promise<PreferencesDTO> {
    const prefs = await this.get(userId);
    let allergens = prefs.allergens;

    if (allergens.includes(ingredient)) {
      allergens = allergens.filter((i) => i !== ingredient);
    } else {
      allergens = [...allergens, ingredient];
    }

    const { rows } = await pool.query<DbUserPreferences>(
      `UPDATE user_preferences SET allergens = $1 WHERE user_id = $2 RETURNING *`,
      [allergens, userId]
    );

    return this.toDTO(rows[0]);
  }

  /** Toggle de intolerancia (añade o quita) */
  async toggleIntolerance(userId: number, intolerance: string): Promise<PreferencesDTO> {
    const prefs = await this.get(userId);
    let intolerances = prefs.intolerances;

    if (intolerances.includes(intolerance)) {
      intolerances = intolerances.filter((i) => i !== intolerance);
    } else {
      intolerances = [...intolerances, intolerance];
    }

    const { rows } = await pool.query<DbUserPreferences>(
      `UPDATE user_preferences SET intolerances = $1 WHERE user_id = $2 RETURNING *`,
      [intolerances, userId]
    );

    return this.toDTO(rows[0]);
  }

  private toDTO(p: DbUserPreferences): PreferencesDTO {
    return {
      favoriteIngredients: p.favorite_ingredients || [],
      allergens: p.allergens || [],
      intolerances: p.intolerances || [],
      preferredCategories: p.preferred_categories || [],
      preferredDifficulty: p.preferred_difficulty || null,
      updatedAt: p.updated_at,
    };
  }
}

export const preferencesService = new PreferencesService();
