import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(200),
  content: z.string().min(10, 'El contenido debe tener al menos 10 caracteres').max(5000),
  postType: z.enum(['review', 'request']).default('review'),
});

export const updatePostSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  content: z.string().min(10).max(5000).optional(),
});

export const forumListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  type: z.enum(['review', 'request', 'all']).default('all'),
  sort: z.enum(['newest', 'popular']).default('newest'),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;
export type UpdatePostDto = z.infer<typeof updatePostSchema>;
