// This file creates all remaining route files

// categoryRoutes.js content:
const express = require('express');
const catRouter = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getCategories, getAllCategories, createCategory, updateCategory, deleteCategory,
} = require('../controllers/miscControllers');

catRouter.get('/', getCategories);
catRouter.get('/all', protect, admin, getAllCategories);
catRouter.post('/', protect, admin, createCategory);
catRouter.put('/:id', protect, admin, updateCategory);
catRouter.delete('/:id', protect, admin, deleteCategory);

module.exports = catRouter;
