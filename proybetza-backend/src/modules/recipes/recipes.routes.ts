import { Router } from 'express';
import { recipesController } from './recipes.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { handleImageUpload } from '../../middleware/upload.middleware';
import { createRecipeSchema, updateRecipeSchema } from './recipes.schemas';

const router = Router();

// ── Rutas públicas ────────────────────────────────────────────────────────────

// GET /api/recipes/ingredients  (antes de /:id para evitar conflicto de rutas)
router.get('/ingredients', recipesController.getAllIngredients.bind(recipesController));

// GET /api/recipes/search?q=...
router.get('/search', recipesController.search.bind(recipesController));

// GET /api/recipes/category/:slug
router.get('/category/:slug', recipesController.getByCategory.bind(recipesController));

// GET /api/recipes
router.get('/', recipesController.list.bind(recipesController));

// GET /api/recipes/recommended  — recomendadas según mis preferencias (antes de /:id para evitar conflicto)
router.get('/recommended', authenticate, recipesController.getRecommended.bind(recipesController));

// GET /api/recipes/:id/image  (antes de /:id para evitar conflicto)
router.get('/:id/image', recipesController.getImage.bind(recipesController));

// GET /api/recipes/:id
router.get('/:id', recipesController.getById.bind(recipesController));

// ── Rutas autenticadas (solo usuario logueado) ────────────────────────────────

// ── Rutas de admin ────────────────────────────────────────────────────────────

// POST /api/recipes
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createRecipeSchema),
  recipesController.create.bind(recipesController)
);

// PUT /api/recipes/:id
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(updateRecipeSchema),
  recipesController.update.bind(recipesController)
);

// POST /api/recipes/:id/image
router.post(
  '/:id/image',
  authenticate,
  authorize('admin'),
  handleImageUpload,
  recipesController.uploadImage.bind(recipesController)
);

// DELETE /api/recipes/:id
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  recipesController.delete.bind(recipesController)
);

export default router;
