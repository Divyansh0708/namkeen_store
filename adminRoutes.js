const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getDashboardStats, getSalesReport } = require('../controllers/orderController');

// Admin overview
router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/sales-report', protect, admin, getSalesReport);

module.exports = router;
