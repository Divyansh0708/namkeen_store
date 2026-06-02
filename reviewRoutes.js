// reviewRoutes.js
const express = require('express');
const reviewRouter = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getProductReviews, createReview, deleteReview } = require('../controllers/miscControllers');

reviewRouter.get('/:productId', getProductReviews);
reviewRouter.post('/', protect, createReview);
reviewRouter.delete('/:id', protect, deleteReview);

module.exports = reviewRouter;
