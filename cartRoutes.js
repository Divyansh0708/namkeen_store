// cartRoutes.js
const express = require('express');
const cartRouter = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCart, addToCart, updateCartItem, removeFromCart, clearCart, applyCoupon, removeCoupon,
} = require('../controllers/cartController');

cartRouter.get('/', protect, getCart);
cartRouter.post('/', protect, addToCart);
cartRouter.post('/coupon', protect, applyCoupon);
cartRouter.delete('/coupon', protect, removeCoupon);
cartRouter.delete('/', protect, clearCart);
cartRouter.put('/:productId', protect, updateCartItem);
cartRouter.delete('/:productId', protect, removeFromCart);

module.exports = cartRouter;
