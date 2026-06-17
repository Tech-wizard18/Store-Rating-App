const express = require('express');
const router = express.Router();
const storeOwnerController = require('../controllers/storeOwnerController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('store_owner'));

// GET /api/store-owner/dashboard
router.get('/dashboard', storeOwnerController.getDashboard);

module.exports = router;
