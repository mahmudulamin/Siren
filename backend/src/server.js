import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/database.js';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'production') {
  const missingVariables = ['MONGODB_URI', 'JWT_SECRET'].filter((key) => !process.env[key]);
  if (missingVariables.length > 0) {
    throw new Error(`Missing required production environment variables: ${missingVariables.join(', ')}`);
  }
}

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`SIREN Backend Server running on port ${PORT} in ${NODE_ENV} mode`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info(`API Documentation: http://localhost:${PORT}/api/docs`);
    });

    // Handle server errors
    server.on('error', (error) => {
      logger.error('Server error', { message: error.message, code: error.code });
      process.exit(1);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', { message: error.message, stack: error.stack });
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', { reason, promise });
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { message: error.message });
    process.exit(1);
  }
};

startServer();
