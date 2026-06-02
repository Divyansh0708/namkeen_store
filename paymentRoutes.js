const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createRazorpayOrder, verifyRazorpayPayment, getRazorpayKey,
} = require('../controllers/paymentController');

router.get('/razorpay/key', getRazorpayKey);
router.post('/razorpay/create', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

module.exports = router;
