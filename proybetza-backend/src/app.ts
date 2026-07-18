import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Routers
import authRoutes from './modules/auth/auth.routes';
import recipesRoutes from './modules/recipes/recipes.routes';
import preferencesRoutes from './modules/preferences/preferences.routes';
import forumRoutes from './modules/forum/forum.routes';

export function createApp(): Application {
  const app = express();

  // ── Seguridad ─────────────────────────────────────────────────────────────
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // permite servir imágenes al frontend
    })
  );

  // CORS
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Rate limiter global (más permisivo que el de auth)
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(globalLimiter);

  // ── Logging ───────────────────────────────────────────────────────────────
  app.use(
    morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', {
      stream: { write: (msg) => logger.http(msg.trim()) },
    })
  );

  // ── Parsers ───────────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ── Health check ──────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // ── Rutas de la API ───────────────────────────────────────────────────────
  app.use('/api/auth',        authRoutes);
  app.use('/api/recipes',     recipesRoutes);
  app.use('/api/preferences', preferencesRoutes);
  app.use('/api/forum',       forumRoutes);

  // ── Manejo de errores ─────────────────────────────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
