import { body, param, query, validationResult } from 'express-validator';

export const validateUpdateVolunteer = [
  param('id')
    .isMongoId()
    .withMessage('Invalid volunteer ID'),
  body('availability')
    .optional()
    .isBoolean()
    .withMessage('Availability must be a boolean'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('location')
    .optional()
    .isObject()
    .withMessage('Location must be an object'),
  body('location.lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('location.lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('bio')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters')
];

export const validateGetVolunteers = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('availability')
    .optional()
    .isBoolean()
    .withMessage('Availability must be a boolean')
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};
