import { Router } from 'express';
import { forumController } from './forum.controller';
import { authenticate, optionalAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createPostSchema, updatePostSchema } from './forum.schemas';

const router = Router();

// GET /api/forum  — lista de posts (pública, pero si hay token muestra si el usuario dio like)
router.get('/', optionalAuth, forumController.list.bind(forumController));

// GET /api/forum/:id
router.get('/:id', optionalAuth, forumController.getById.bind(forumController));

// POST /api/forum  — crear post (requiere auth)
router.post('/', authenticate, validate(createPostSchema), forumController.create.bind(forumController));

// PUT /api/forum/:id  — editar post (solo autor)
router.put('/:id', authenticate, validate(updatePostSchema), forumController.update.bind(forumController));

// DELETE /api/forum/:id  — eliminar post (autor o admin)
router.delete('/:id', authenticate, forumController.delete.bind(forumController));

// POST /api/forum/:id/like  — dar/quitar like
router.post('/:id/like', authenticate, forumController.toggleLike.bind(forumController));

export default router;
