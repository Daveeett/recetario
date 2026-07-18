import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { logger } from './config/logger';

async function bootstrap(): Promise<void> {
  // 1. Verificar conexión a base de datos
  await connectDatabase();

  // 2. Crear la aplicación Express
  const app = createApp();

  // 3. Iniciar el servidor
  const server = app.listen(env.PORT, () => {
    logger.info(`http://localhost:${env.PORT}`);
    logger.info(`cors permitias: ${env.CORS_ORIGIN}`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    logger.info(`\n${signal} recibido. Cerrando `);
    server.close(async () => {
      logger.info('Servidor apagado,cerrando conexiones');
      const { pool } = await import('./config/database');
      await pool.end();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Captura errores no manejados
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', { reason });
  });
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', { error: err.message, stack: err.stack });
    process.exit(1);
  });
}

bootstrap().catch((err) => {
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});
