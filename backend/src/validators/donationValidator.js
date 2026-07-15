import { body, query, validationResult } from 'express-validator';

export const validateCreateDonation = [
  body('donorName')
    .trim()
    .notEmpty()
    .withMessage('Donor name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
    .withMessage('Please provide a valid phone number'),
  body('type')
    .isIn(['money', 'supply'])
    .withMessage('Type must be either money or supply'),
  body('category')
    .isIn([
      'General Relief Fund',
      'Food & Water Supplies',
      'Medical Supplies & Treatment',
      'Shelter & Rehabilitation',
      'Rescue Operations',
      'Emergency Reserve Fund'
    ])
    .withMessage('Invalid category'),
  body('amount')
    .if((value, { req }) => req.body.type === 'money')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('items')
    .if((value, { req }) => req.body.type === 'supply')
    .isArray({ min: 1 })
    .withMessage('Items array is required for supply donations'),
  body('quantity')
    .if((value, { req }) => req.body.type === 'supply')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('currency')
    .optional()
    .isIn(['BDT', 'USD', 'EUR'])
    .withMessage('Invalid currency'),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('anonymous')
    .optional()
    .isBoolean()
    .withMessage('Anonymous must be a boolean'),
  body('paymentMethod')
    .optional()
    .isIn(['bKash', 'Nagad', 'Rocket', 'Card', 'Bank Transfer', 'Direct'])
    .withMessage('Invalid payment method')
];

export const validateGetDonations = [
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
    .isIn(['pending', 'verified', 'completed', 'failed'])
    .withMessage('Invalid status'),
  query('category')
    .optional()
    .isIn([
      'General Relief Fund',
      'Food & Water Supplies',
      'Medical Supplies & Treatment',
      'Shelter & Rehabilitation',
      'Rescue Operations',
      'Emergency Reserve Fund'
    ])
    .withMessage('Invalid category')
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
