const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const passwordRules = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8-16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('Password must contain at least one special character');

router.use(authenticate, authorize('admin'));

// GET /api/admin/dashboard
router.get('/dashboard', adminController.getDashboard);

// Users
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post(
  '/users',
  [
    body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters'),
    body('email').isEmail().withMessage('Invalid email'),
    body('address').optional().isLength({ max: 400 }).withMessage('Address max 400 characters'),
    body('role').isIn(['admin', 'user', 'store_owner']).withMessage('Invalid role'),
    passwordRules,
  ],
  validate,
  adminController.createUser
);

// Stores
router.get('/stores', adminController.getStores);
router.post(
  '/stores',
  [
    body('name').isLength({ min: 20, max: 60 }).withMessage('Store name must be 20-60 characters'),
    body('email').isEmail().withMessage('Invalid email'),
    body('address').optional().isLength({ max: 400 }).withMessage('Address max 400 characters'),
    body('owner_id').optional().isInt().withMessage('Invalid owner ID'),
  ],
  validate,
  adminController.createStore
);

module.exports = router;
