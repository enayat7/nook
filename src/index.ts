import { app } from './app';
import { DatabaseConnection } from '../db/connection';
import { config } from '../config';
import { logger } from './utils/logger';

async function startServer() {
  try {
    logger.info('Starting server...');
    
    // Connect to database
    const db = DatabaseConnection.getInstance();
    await db.connect();
    
    // Start server
    const server = app.listen(config.port, '0.0.0.0', () => {
      logger.info(`🚀 Server running on http://localhost:${config.port} in ${config.env} mode`);
      logger.info(`📊 Health check: http://localhost:${config.port}/health`);
      logger.info(`🔐 Auth API: http://localhost:${config.port}/auth/api/`);
    });
    
    server.on('error', (error: any) => {
      logger.error('Server error:', error);
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  const db = DatabaseConnection.getInstance();
  await db.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  const db = DatabaseConnection.getInstance();
  await db.disconnect();
  process.exit(0);
});

startServer();