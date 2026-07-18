import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { registerSchema, loginSchema } from './auth.schemas';

const router = Router();

// Rate limiter estricto para endpoints de autenticación (anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,                   // máximo 10 intentos por IP
  message: {
    success: false,
    error: {
      message: 'Demasiados intentos. Por favor espera 15 minutos.',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/register
router.post('/register', authLimiter, validate(registerSchema), authController.register.bind(authController));

// POST /api/auth/login
router.post('/login', authLimiter, validate(loginSchema), authController.login.bind(authController));

// GET /api/auth/me  (requiere token)
router.get('/me', authenticate, authController.me.bind(authController));

export default router;
