import { readFileSync } from 'fs';
import { join } from 'path';
import { pool } from '../config/database';
import { logger } from '../config/logger';
import dotenv from 'dotenv';

dotenv.config();

async function migrate(): Promise<void> {
  const client = await pool.connect();
  try {
    logger.info('Ejecutando...');

    // Tabla de control de migraciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id         SERIAL PRIMARY KEY,
        filename   VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);

    const migrationFiles = ['001_initial.sql', '002_add_intolerances.sql'];

    for (const file of migrationFiles) {
      const { rows } = await client.query(
        'SELECT id FROM _migrations WHERE filename = $1',
        [file]
      );

      if (rows.length > 0) {
        logger.info(`  ✓ ${file} (ya aplicada)`);
        continue;
      }

      const sql = readFileSync(join(__dirname, 'migrations', file), 'utf-8');
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        'INSERT INTO _migrations (filename) VALUES ($1)',
        [file]
      );
      await client.query('COMMIT');
    }

    logger.info(' Migraciones completadas');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    logger.error(' Error en migraciones', { error: (err as Error).message });
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
