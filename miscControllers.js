const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const { Review, Coupon, Newsletter } = require('../models/index');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// ==================== CATEGORY ====================
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('sortOrder name').lean();
  res.json({ success: true, categories });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort('sortOrder name').lean();
  res.json({ success: true, categories });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) { res.status(404); throw new Error('Category not found'); }
  res.json({ success: true, category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) { res.status(404); throw new Error('Category not found'); }
  // Check if products exist
  const productCount = await Product.countDocuments({ category: req.params.id });
  if (productCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete category with ${productCount} products`);
  }
  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
});

// ==================== REVIEWS ====================
const getProductReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Review.countDocuments({ product: req.params.productId, isApproved: true }),
  ]);

  res.json({ success: true, reviews, total, pages: Math.ceil(total / limit) });
});

const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, title, comment } = req.body;

  const existing = await Review.findOne({ user: req.user.id, product: productId });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = await Review.create({
    user: req.user.id,
    product: productId,
    rating,
    title,
    comment,
  });

  await review.populate('user', 'name avatar');
  res.status(201).json({ success: true, review });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  await review.deleteOne();
  res.json({ success: true, message: 'Review deleted' });
});

// ==================== USER ADMIN ====================
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(query).sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
    User.countDocuments(query),
  ]);
  res.json({ success: true, users, total });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, user });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role, isActive: req.body.isActive }, { new: true });
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, user });
});

// ==================== COUPON ADMIN ====================
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt').lean();
  res.json({ success: true, coupons });
});

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!coupon) { res.status(404); throw new Error('Coupon not found'); }
  res.json({ success: true, coupon });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Coupon deleted' });
});

// ==================== NEWSLETTER ====================
const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const existing = await Newsletter.findOne({ email });
  if (existing) {
    if (!existing.isActive) {
      existing.isActive = true;
      await existing.save();
    }
    return res.json({ success: true, message: 'Already subscribed!' });
  }
  await Newsletter.create({ email });
  res.status(201).json({ success: true, message: 'Subscribed successfully!' });
});

module.exports = {
  getCategories, getAllCategories, createCategory, updateCategory, deleteCategory,
  getProductReviews, createReview, deleteReview,
  getAllUsers, getUserById, updateUserRole,
  getCoupons, createCoupon, updateCoupon, deleteCoupon,
  subscribeNewsletter,
};
