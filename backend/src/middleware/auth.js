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

// Emergency reports must remain submit-able when a victim has no active
// session. A valid token still associates the report with the user, while a
// missing or expired token falls back to an anonymous, rate-limited report.
export const optionalAuthenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    req.user = verifyToken(token);
  } catch (error) {
    logger.warn('Ignoring invalid token on public emergency report', {
      message: error.message
    });
    req.user = null;
  }

  return next();
};
