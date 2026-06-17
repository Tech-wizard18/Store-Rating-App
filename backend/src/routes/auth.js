const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

const passwordRules = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8-16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('Password must contain at least one special character');

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('address').optional().isLength({ max: 400 }).withMessage('Address max 400 characters'),
    passwordRules,
  ],
  validate,
  authController.register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  validate,
  authController.login
);

// PUT /api/auth/change-password
router.put(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    passwordRules,
  ],
  validate,
  authController.changePassword
);

// GET /api/auth/me
router.get('/me', authenticate, authController.me);

module.exports = router;
