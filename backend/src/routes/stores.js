const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const storeController = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

// GET /api/stores - public list with search
router.get('/', authenticate, storeController.getStores);

// GET /api/stores/:id
router.get('/:id', authenticate, storeController.getStoreById);

// POST /api/stores/:id/rate - normal users only
router.post(
  '/:id/rate',
  authenticate,
  authorize('user'),
  [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
  ],
  validate,
  storeController.submitRating
);

module.exports = router;
