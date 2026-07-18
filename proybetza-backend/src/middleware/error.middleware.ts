import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { logger } from '../config/logger';

/**
 * Manejador global de errores de Express.
 * Debe registrarse ÚLTIMO en app.use().
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Errores de nuestra aplicación (operacionales)
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`[${req.method} ${req.path}] ${err.message}`, {
        statusCode: err.statusCode,
        code: err.code,
        stack: err.stack,
      });
    } else {
      logger.warn(`[${req.method} ${req.path}] ${err.message}`, {
        statusCode: err.statusCode,
        code: err.code,
      });
    }

    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    });
    return;
  }

  // Errores de PostgreSQL
  if ((err as NodeJS.ErrnoException).code) {
    const pgErr = err as NodeJS.ErrnoException & { code: string; constraint?: string };
    if (pgErr.code === '23505') {
      // unique_violation
      res.status(409).json({
        success: false,
        error: {
          message: 'El recurso ya existe (conflicto de clave única)',
          code: 'UNIQUE_VIOLATION',
          constraint: pgErr.constraint,
        },
      });
      return;
    }
    if (pgErr.code === '23503') {
      // foreign_key_violation
      res.status(400).json({
        success: false,
        error: { message: 'Referencia a recurso inexistente', code: 'FOREIGN_KEY_VIOLATION' },
      });
      return;
    }
  }

  // Error inesperado — loguear completo, responder genérico
  logger.error(`[${req.method} ${req.path}] Error inesperado`, {
    error: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    success: false,
    error: {
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
    },
  });
}

/** Handler para rutas no encontradas */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      message: `Ruta ${req.method} ${req.path} no encontrada`,
      code: 'NOT_FOUND',
    },
  });
}
