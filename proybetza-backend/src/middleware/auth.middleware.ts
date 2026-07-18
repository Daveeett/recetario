import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../errors/app-error';
import { JwtPayload, UserRole } from '../modules/auth/auth.types';

function decodeToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as unknown as JwtPayload;
}

/**
 * Extrae y verifica el JWT del header Authorization.
 * Agrega `req.user` con el payload decodificado.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError('Token de autenticación requerido', 401, 'AUTH_REQUIRED'));
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = decodeToken(token);
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expirado', 401, 'TOKEN_EXPIRED'));
    } else {
      next(new AppError('Token inválido', 401, 'TOKEN_INVALID'));
    }
  }
}

/**
 * Middleware de autorización por rol.
 * Debe usarse DESPUÉS de `authenticate`.
 */
export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('No autenticado', 401, 'AUTH_REQUIRED'));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError('No tienes permisos para realizar esta acción', 403, 'FORBIDDEN'));
      return;
    }
    next();
  };
}

/** Middleware opcional: agrega el usuario si hay token, pero no falla si no lo hay */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }
  try {
    const token = authHeader.slice(7);
    const payload = decodeToken(token);
    req.user = payload;
  } catch {
    // ignoramos errores — auth es opcional
  }
  next();
}
