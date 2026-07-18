import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../errors/app-error';

type RequestPart = 'body' | 'params' | 'query';

/**
 * Middleware de validación con Zod.
 * Valida req.body, req.params o req.query según `part`.
 */
export function validate(schema: ZodSchema, part: RequestPart = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      next(new AppError(`Datos inválidos: ${errors.join(', ')}`, 422, 'VALIDATION_ERROR'));
      return;
    }
    // Reemplaza con los datos parseados (stripped + coerced)
    req[part] = result.data as Record<string, unknown>;
    next();
  };
}

function formatZodErrors(error: ZodError): string[] {
  return error.errors.map((e) => {
    const path = e.path.join('.');
    return path ? `${path}: ${e.message}` : e.message;
  });
}
