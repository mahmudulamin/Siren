import { body, query, param, validationResult } from 'express-validator';

export const validateCreateRequest = [
  body('victimName')
    .trim()
    .notEmpty()
    .withMessage('Victim name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
    .withMessage('Please provide a valid phone number'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('coordinates.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('coordinates.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('emergencyType')
    .isIn(['Flood', 'Medical Emergency', 'Food/Water Shortage', 'Shelter', 'Rescue', 'Other'])
    .withMessage('Invalid emergency type'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('severity')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Severity must be one of: low, medium, high, critical')
];

export const validateUpdateRequest = [
  param('id')
    .isMongoId()
    .withMessage('Invalid request ID'),
  body('status')
    .optional()
    .isIn(['pending', 'assigned', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  body('assignedVolunteer')
    .optional()
    .isObject()
    .withMessage('Invalid volunteer data'),
  body('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity')
];

export const validateGetRequests = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['pending', 'assigned', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  query('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity'),
  query('emergencyType')
    .optional()
    .isIn(['Flood', 'Medical Emergency', 'Food/Water Shortage', 'Shelter', 'Rescue', 'Other'])
    .withMessage('Invalid emergency type'),
  query('search')
    .optional()
    .isString()
    .trim()
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
