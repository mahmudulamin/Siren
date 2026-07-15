import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import logger from './utils/logger.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
app.use(morgan('dev'));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting
app.use('/api/', generalLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/api/docs/swagger.json'
  }
}));

// Swagger JSON
app.get('/api/docs/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SIREN Backend is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

logger.info('Express app configured successfully');

export default app;
