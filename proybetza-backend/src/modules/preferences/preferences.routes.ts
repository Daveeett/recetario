import { Router } from 'express';
import { preferencesController } from './preferences.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { updatePreferencesSchema, toggleIngredientSchema, toggleIntoleranceSchema } from './preferences.schemas';

const router = Router();

// Todas las rutas de preferencias requieren autenticación
router.use(authenticate);

// GET /api/preferences
router.get('/', preferencesController.get.bind(preferencesController));

// PUT /api/preferences
router.put('/', validate(updatePreferencesSchema), preferencesController.update.bind(preferencesController));

// POST /api/preferences/favorites/toggle
router.post(
  '/favorites/toggle',
  validate(toggleIngredientSchema),
  preferencesController.toggleFavorite.bind(preferencesController)
);

// POST /api/preferences/allergens/toggle
router.post(
  '/allergens/toggle',
  validate(toggleIngredientSchema),
  preferencesController.toggleAllergen.bind(preferencesController)
);

// POST /api/preferences/intolerances/toggle
router.post(
  '/intolerances/toggle',
  validate(toggleIntoleranceSchema),
  preferencesController.toggleIntolerance.bind(preferencesController)
);

export default router;
