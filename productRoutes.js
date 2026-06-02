const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct, getFeaturedProducts,
} = require('../controllers/productController');

router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:slug', getProduct);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
