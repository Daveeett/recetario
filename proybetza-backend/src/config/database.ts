import { Pool, PoolConfig } from 'pg';
import { env } from './env';
import { logger } from './logger';

const poolConfig: PoolConfig = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
  max: 20,                 // máximo de conexiones en el pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(poolConfig);

pool.on('connect', () => {
  logger.debug('Nueva conexión establecida con PostgreSQL');
});

pool.on('error', (err) => {
  logger.error('Error inesperado en cliente PostgreSQL', { error: err.message });
  process.exit(1);
});

/**
 * Función helper para transacciones.
 * Uso: await withTransaction(async (client) => { ... })
 */
export async function withTransaction<T>(
  fn: (client: import('pg').PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/** Verifica la conexión a la DB al iniciar */
export async function connectDatabase(): Promise<void> {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as now');
    client.release();
    logger.info(`Conextion correcta`);
  } catch (err) {
    logger.error('No se pudo conectar', { error: (err as Error).message });
    throw err;
  }
}
