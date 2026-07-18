import multer, { StorageEngine, FileFilterCallback } from 'multer';
import { Request } from 'express';
import { env } from '../config/env';
import { AppError } from '../errors/app-error';

/** Almacena en memoria para luego guardar en PostgreSQL BYTEA */
const memoryStorage: StorageEngine = multer.memoryStorage();

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function imageFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Solo se permiten imágenes (JPEG, PNG, WebP, GIF)', 415, 'INVALID_FILE_TYPE'));
  }
}

export const uploadImage = multer({
  storage: memoryStorage,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
    files: 1,
  },
  fileFilter: imageFilter,
}).single('image');

/** Wrapper de uploadImage como middleware async-friendly */
export function handleImageUpload(
  req: Request,
  res: import('express').Response,
  next: import('express').NextFunction
): void {
  uploadImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        next(new AppError(`La imagen supera el tamaño máximo de ${env.MAX_FILE_SIZE_MB}MB`, 413, 'FILE_TOO_LARGE'));
        return;
      }
      next(new AppError(err.message, 400, 'UPLOAD_ERROR'));
      return;
    }
    if (err) {
      next(err);
      return;
    }
    next();
  });
}
