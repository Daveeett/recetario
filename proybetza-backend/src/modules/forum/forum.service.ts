import { pool } from '../../config/database';
import { AppError } from '../../errors/app-error';
import { PaginatedResponse } from '../../types';
import { ForumPostDTO } from './forum.types';
import { CreatePostDto, UpdatePostDto } from './forum.schemas';

export class ForumService {
  /** Lista posts del foro con paginación, filtro por tipo y orden */
  async list(params: {
    page: number;
    limit: number;
    type: string;
    sort: string;
    userId?: number;
  }): Promise<PaginatedResponse<ForumPostDTO>> {
    const { page, limit, type, sort, userId } = params;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (type !== 'all') {
      conditions.push(`fp.post_type = $${idx++}`);
      values.push(type);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderBy = sort === 'popular' ? 'fp.likes_count DESC, fp.created_at DESC' : 'fp.created_at DESC';

    const countQ = `SELECT COUNT(*) FROM forum_posts fp ${where}`;
    const { rows: countRows } = await pool.query(countQ, values);
    const total = parseInt(countRows[0].count, 10);

    // Columna dinámica para saber si el usuario ya dio like
    const userLikeCol = userId
      ? `CASE WHEN fl.user_id IS NOT NULL THEN true ELSE false END AS user_has_liked`
      : `false AS user_has_liked`;

    const userLikeJoin = userId
      ? `LEFT JOIN forum_likes fl ON fl.post_id = fp.id AND fl.user_id = $${idx++}`
      : '';

    if (userId) values.push(userId);

    values.push(limit, offset);

    const { rows } = await pool.query(
      `SELECT
        fp.id, fp.user_id, fp.title, fp.content, fp.post_type,
        fp.likes_count, fp.created_at, fp.updated_at,
        u.username,
        ${userLikeCol}
      FROM forum_posts fp
      INNER JOIN users u ON u.id = fp.user_id
      ${userLikeJoin}
      ${where}
      ORDER BY ${orderBy}
      LIMIT $${idx++} OFFSET $${idx++}`,
      values
    );

    return {
      data: rows.map(this.rowToDTO),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /** Obtiene un post por ID */
  async getById(id: number, userId?: number): Promise<ForumPostDTO> {
    const userLikeCol = userId
      ? `CASE WHEN fl.user_id IS NOT NULL THEN true ELSE false END AS user_has_liked`
      : `false AS user_has_liked`;

    const userLikeJoin = userId ? `LEFT JOIN forum_likes fl ON fl.post_id = fp.id AND fl.user_id = $2` : '';

    const values: unknown[] = [id];
    if (userId) values.push(userId);

    const { rows } = await pool.query(
      `SELECT
        fp.id, fp.user_id, fp.title, fp.content, fp.post_type,
        fp.likes_count, fp.created_at, fp.updated_at,
        u.username, ${userLikeCol}
      FROM forum_posts fp
      INNER JOIN users u ON u.id = fp.user_id
      ${userLikeJoin}
      WHERE fp.id = $1`,
      values
    );

    if (!rows[0]) throw new AppError('Post no encontrado', 404, 'POST_NOT_FOUND');
    return this.rowToDTO(rows[0]);
  }

  /** Crea un nuevo post */
  async create(userId: number, dto: CreatePostDto): Promise<ForumPostDTO> {
    const { rows } = await pool.query(
      `INSERT INTO forum_posts (user_id, title, content, post_type)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [userId, dto.title, dto.content, dto.postType]
    );
    return this.getById(rows[0].id, userId);
  }

  /** Actualiza un post (solo el autor) */
  async update(id: number, userId: number, dto: UpdatePostDto): Promise<ForumPostDTO> {
    const post = await this.getById(id, userId);

    if (post.userId !== userId) {
      throw new AppError('Solo puedes editar tus propios posts', 403, 'FORBIDDEN');
    }

    await pool.query(
      `UPDATE forum_posts SET
        title   = COALESCE($1, title),
        content = COALESCE($2, content)
      WHERE id = $3`,
      [dto.title ?? null, dto.content ?? null, id]
    );

    return this.getById(id, userId);
  }

  /** Elimina un post (el autor o admin) */
  async delete(id: number, userId: number, userRole: string): Promise<void> {
    const post = await this.getById(id);

    if (post.userId !== userId && userRole !== 'admin') {
      throw new AppError('No tienes permiso para eliminar este post', 403, 'FORBIDDEN');
    }

    const { rowCount } = await pool.query('DELETE FROM forum_posts WHERE id = $1', [id]);
    if (!rowCount) throw new AppError('Post no encontrado', 404, 'POST_NOT_FOUND');
  }

  /** Toggle like en un post */
  async toggleLike(postId: number, userId: number): Promise<{ liked: boolean; likesCount: number }> {
    await this.getById(postId); // verifica existencia

    const { rows: existing } = await pool.query(
      'SELECT 1 FROM forum_likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    );

    let liked: boolean;
    if (existing.length > 0) {
      // Quitar like
      await pool.query('DELETE FROM forum_likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
      await pool.query('UPDATE forum_posts SET likes_count = likes_count - 1 WHERE id = $1', [postId]);
      liked = false;
    } else {
      // Dar like
      await pool.query('INSERT INTO forum_likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
      await pool.query('UPDATE forum_posts SET likes_count = likes_count + 1 WHERE id = $1', [postId]);
      liked = true;
    }

    const { rows } = await pool.query('SELECT likes_count FROM forum_posts WHERE id = $1', [postId]);
    return { liked, likesCount: rows[0].likes_count };
  }

  private rowToDTO(row: Record<string, unknown>): ForumPostDTO {
    return {
      id: row.id as number,
      userId: row.user_id as number,
      username: row.username as string,
      title: row.title as string,
      content: row.content as string,
      postType: row.post_type as 'review' | 'request',
      likesCount: row.likes_count as number,
      userHasLiked: Boolean(row.user_has_liked),
      createdAt: row.created_at as Date,
      updatedAt: row.updated_at as Date,
    };
  }
}

export const forumService = new ForumService();
