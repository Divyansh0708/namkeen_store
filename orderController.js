const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { Cart } = require('../models/index');
const sendEmail = require('../utils/sendEmail');

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, couponCode, discountAmount, notes } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Validate stock and calculate price
  let itemsPrice = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const price = product.offerPrice || product.price;
    itemsPrice += price * item.quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      price,
      quantity: item.quantity,
    });

    // Reduce stock
    product.stock -= item.quantity;
    await product.save();
  }

  const taxPrice = Math.round(itemsPrice * 0.05 * 100) / 100; // 5% GST
  const shippingPrice = itemsPrice >= 499 ? 0 : 49;
  const totalPrice = itemsPrice + taxPrice + shippingPrice - (discountAmount || 0);

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    discountAmount: discountAmount || 0,
    totalPrice: Math.max(totalPrice, 0),
    couponCode,
    notes,
    statusHistory: [{ status: 'placed' }],
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
  });

  // Clear cart
  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

  // Send confirmation email
  try {
    await sendEmail({
      to: req.user.email,
      subject: `Order Confirmed! #${order.orderNumber}`,
      template: 'orderConfirmation',
      data: { order, user: req.user },
    });
    order.isEmailSent = true;
    await order.save();
  } catch (err) {
    console.log('Order email failed:', err.message);
  }

  const populatedOrder = await Order.findById(order._id).populate('user', 'name email phone');
  res.status(201).json({ success: true, order: populatedOrder });
});

// @desc    Get user orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user.id })
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Order.countDocuments({ user: req.user.id }),
  ]);

  res.json({ success: true, orders, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only admin or the order owner
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, order });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
    res.status(400);
    throw new Error(`Cannot cancel order with status: ${order.orderStatus}`);
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }

  order.orderStatus = 'cancelled';
  await order.save();

  res.json({ success: true, order });
});

// ==================== ADMIN ====================

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const query = {};
  if (status) query.orderStatus = status;
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name email phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(query),
  ]);

  res.json({ success: true, orders, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.orderStatus = status;
  if (note) order.statusHistory[order.statusHistory.length - 1].note = note;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (status === 'delivered') {
    order.deliveredAt = new Date();
    order.paymentStatus = 'paid';
  }

  await order.save();

  // Send status update email
  try {
    await sendEmail({
      to: order.user.email,
      subject: `Order Update: ${status.toUpperCase()} - #${order.orderNumber}`,
      template: 'orderStatus',
      data: { order, user: order.user },
    });
  } catch (err) {
    console.log('Status email failed:', err.message);
  }

  res.json({ success: true, order });
});

// @desc    Admin dashboard stats
// @route   GET /api/orders/admin/stats
// @access  Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalOrders,
    todayOrders,
    monthlyOrders,
    totalRevenue,
    monthlyRevenue,
    statusCounts,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.countDocuments({ createdAt: { $gte: thisMonth } }),
    Order.aggregate([{ $match: { orderStatus: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.aggregate([{ $match: { createdAt: { $gte: thisMonth }, orderStatus: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
    Order.find().populate('user', 'name email').sort('-createdAt').limit(5).lean(),
    Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]),
  ]);

  res.json({
    success: true,
    stats: {
      totalOrders,
      todayOrders,
      monthlyOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      statusCounts,
      recentOrders,
      topProducts,
    },
  });
});

// @desc    Sales report (monthly chart data)
// @route   GET /api/orders/admin/sales-report
// @access  Admin
const getSalesReport = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyData = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, orderStatus: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        orders: { $sum: 1 },
        revenue: { $sum: '$totalPrice' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({ success: true, monthlyData });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  getSalesReport,
};
