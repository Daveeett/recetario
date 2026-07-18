import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DB_HOST: z.string().min(1, 'DB_HOST es requerido'),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string().min(1, 'DB_NAME es requerido'),
  DB_USER: z.string().min(1, 'DB_USER es requerido'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD es requerido'),
  DB_SSL: z.preprocess((val) => val === 'true' || val === '1', z.boolean()).default(false),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:4200'),
  MAX_FILE_SIZE_MB: z.coerce.number().default(5),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Error en las variables de entorno:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
