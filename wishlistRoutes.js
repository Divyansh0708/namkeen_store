const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getWishlist, toggleWishlist } = require('../controllers/cartController');

router.get('/', protect, getWishlist);
router.post('/:productId', protect, toggleWishlist);

module.exports = router;
