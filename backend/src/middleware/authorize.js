import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('User not authenticated');
      }

      if (!allowedRoles.includes(req.user.role)) {
        logger.warn('Unauthorized access attempt', {
          userId: req.user._id,
          userRole: req.user.role,
          requiredRoles: allowedRoles
        });
        throw ApiError.forbidden('Insufficient permissions for this action');
      }

      next();
    } catch (error) {
      const statusCode = error.statusCode || 403;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Forbidden',
        errors: error.errors || []
      });
    }
  };
};
