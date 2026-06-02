const asyncHandler = require('express-async-handler');
const { Cart, Wishlist, Coupon } = require('../models/index');
const Product = require('../models/Product');

// ==================== CART ====================

// @desc    Get cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate({
    path: 'items.product',
    select: 'name images price offerPrice stock isActive slug',
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Remove items with inactive products or out-of-stock
  if (cart.items.length > 0) {
    cart.items = cart.items.filter(
      (item) => item.product && item.product.isActive && item.product.stock > 0
    );
    await cart.save();
  }

  res.json({ success: true, cart });
});

// @desc    Add to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock');
  }

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  const price = product.offerPrice || product.price;
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock, 10);
    existingItem.price = price;
  } else {
    cart.items.push({ product: productId, quantity, price });
  }

  await cart.save();
  await cart.populate({ path: 'items.product', select: 'name images price offerPrice stock slug' });

  res.json({ success: true, cart });
});

// @desc    Update cart item
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  } else {
    const product = await Product.findById(req.params.productId);
    item.quantity = Math.min(quantity, product.stock, 10);
  }

  await cart.save();
  await cart.populate({ path: 'items.product', select: 'name images price offerPrice stock slug' });

  res.json({ success: true, cart });
});

// @desc    Remove from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  await cart.populate({ path: 'items.product', select: 'name images price offerPrice stock slug' });
  res.json({ success: true, cart });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], couponCode: null, discount: 0 });
  res.json({ success: true, message: 'Cart cleared' });
});

// @desc    Apply coupon
// @route   POST /api/cart/coupon
// @access  Private
const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) {
    res.status(400);
    throw new Error('Invalid coupon code');
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    res.status(400);
    throw new Error('Coupon has expired');
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error('Coupon usage limit reached');
  }

  const userUsed = coupon.usedBy.filter(
    (uid) => uid.toString() === req.user.id
  ).length;
  if (userUsed >= coupon.userLimit) {
    res.status(400);
    throw new Error('You have already used this coupon');
  }

  const cart = await Cart.findOne({ user: req.user.id });
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (subtotal < coupon.minOrderAmount) {
    res.status(400);
    throw new Error(`Minimum order amount is ₹${coupon.minOrderAmount}`);
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  } else {
    discount = coupon.discountValue;
  }

  cart.couponCode = coupon.code;
  cart.discount = Math.round(discount);
  await cart.save();

  res.json({
    success: true,
    message: `Coupon applied! You save ₹${cart.discount}`,
    discount: cart.discount,
    coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
  });
});

// @desc    Remove coupon
// @route   DELETE /api/cart/coupon
// @access  Private
const removeCoupon = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user.id }, { couponCode: null, discount: 0 });
  res.json({ success: true, message: 'Coupon removed' });
});

// ==================== WISHLIST ====================

// @desc    Get wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
    path: 'products',
    select: 'name images price offerPrice ratings numReviews stock isActive slug',
    match: { isActive: true },
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, products: [] });
  }

  res.json({ success: true, wishlist });
});

// @desc    Toggle wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, products: [] });
  }

  const index = wishlist.products.indexOf(req.params.productId);
  let action;
  if (index === -1) {
    wishlist.products.push(req.params.productId);
    action = 'added';
  } else {
    wishlist.products.splice(index, 1);
    action = 'removed';
  }
  await wishlist.save();

  res.json({ success: true, action, inWishlist: action === 'added' });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  getWishlist,
  toggleWishlist,
};
