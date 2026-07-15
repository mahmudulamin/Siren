import { verifyToken } from '../utils/generateToken.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      logger.warn('Missing authentication token');
      throw ApiError.unauthorized('No authorization token provided');
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication failed', { message: error.message });
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      errors: [error.message]
    });
  }
};
