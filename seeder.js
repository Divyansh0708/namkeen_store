const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { Coupon } = require('../models/index');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB Connected for seeding');
};

const categories = [
  { name: 'Bhujia', icon: '🫘', description: 'Crispy and spicy bhujia varieties', sortOrder: 1 },
  { name: 'Sev', icon: '🍜', description: 'Fine and thick sev snacks', sortOrder: 2 },
  { name: 'Mixture', icon: '🥜', description: 'Assorted mixture snacks', sortOrder: 3 },
  { name: 'Chips', icon: '🥔', description: 'Crispy potato and veggie chips', sortOrder: 4 },
  { name: 'Diet Namkeen', icon: '🥗', description: 'Low-calorie healthy namkeen', sortOrder: 5 },
  { name: 'Sugar Free Snacks', icon: '💚', description: 'Sugar-free snack options', sortOrder: 6 },
  { name: 'Healthy Snacks', icon: '🌾', description: 'Nutritious and healthy snacks', sortOrder: 7 },
  { name: 'Traditional Snacks', icon: '🏺', description: 'Time-honored traditional recipes', sortOrder: 8 },
];

const getProducts = (categoryMap) => [
  {
    name: 'Bikaneri Bhujia Special',
    shortDescription: 'The authentic taste of Bikaner in every bite',
    description: 'Our signature Bikaneri Bhujia is crafted from the finest moth lentils sourced directly from Rajasthan. Made using a traditional recipe passed down through generations, this crispy snack delivers an authentic taste that has made it legendary across India. Perfect with tea or as an anytime snack.',
    ingredients: 'Moth lentils (besan), vegetable oil, salt, red chilli powder, black pepper, asafoetida, dried mango powder',
    price: 120,
    offerPrice: 99,
    category: categoryMap['Bhujia'],
    stock: 150,
    weight: '400g',
    isFeatured: true,
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600'],
    tags: ['bhujia', 'rajasthani', 'spicy', 'crispy'],
    shelfLife: '6 months',
    storage: 'Store in a cool, dry place',
    ratings: 4.7,
    numReviews: 234,
    nutritionInfo: { calories: '520 kcal', protein: '18g', carbs: '52g', fat: '26g', fiber: '8g', sodium: '980mg' },
  },
  {
    name: 'Aloo Bhujia Premium',
    shortDescription: 'Thin, crispy potato bhujia — simply irresistible',
    description: 'Made from the finest potatoes blended with gram flour and an aromatic mix of spices, our Aloo Bhujia is a timeless snack loved by all age groups. Light, crispy, and perfectly spiced — it\'s the perfect companion to your evening chai.',
    ingredients: 'Potato, gram flour, vegetable oil, spices, salt',
    price: 95,
    offerPrice: 79,
    category: categoryMap['Bhujia'],
    stock: 200,
    weight: '250g',
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600'],
    tags: ['aloo', 'bhujia', 'potato'],
    shelfLife: '5 months',
    ratings: 4.5,
    numReviews: 189,
    nutritionInfo: { calories: '490 kcal', protein: '12g', carbs: '60g', fat: '22g', fiber: '5g', sodium: '850mg' },
  },
  {
    name: 'Fine Sev Classic',
    shortDescription: 'Delicate, thin sev made from premium gram flour',
    description: 'Our Fine Sev is made from carefully selected gram flour, deep-fried to a perfect golden crisp. It has a delicate texture and a mildly spiced flavor that makes it a versatile snack — eat it alone, sprinkle on chaat, or mix it into your favorite dish.',
    ingredients: 'Gram flour, vegetable oil, salt, ajwain, turmeric, black pepper',
    price: 80,
    category: categoryMap['Sev'],
    stock: 180,
    weight: '200g',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600'],
    tags: ['sev', 'gram flour', 'crispy'],
    shelfLife: '4 months',
    ratings: 4.3,
    numReviews: 145,
    nutritionInfo: { calories: '510 kcal', protein: '16g', carbs: '55g', fat: '25g', fiber: '7g', sodium: '900mg' },
  },
  {
    name: 'Ratlami Sev Spicy',
    shortDescription: 'Bold, spicy sev from the heart of Madhya Pradesh',
    description: 'Ratlami Sev is famous across India for its distinct flavor profile — the unique blend of cloves, black pepper, and red chilli creates a bold, spicy taste that keeps you coming back for more. Authentically prepared with the original Ratlami recipe.',
    ingredients: 'Gram flour, vegetable oil, cloves, black pepper, red chilli, salt, asafoetida',
    price: 110,
    offerPrice: 89,
    category: categoryMap['Sev'],
    stock: 120,
    weight: '250g',
    isNew: true,
    images: ['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600'],
    tags: ['ratlami', 'sev', 'spicy', 'madhya pradesh'],
    ratings: 4.6,
    numReviews: 98,
    nutritionInfo: { calories: '530 kcal', protein: '17g', carbs: '53g', fat: '27g', fiber: '8g', sodium: '1020mg' },
  },
  {
    name: 'Bombay Mix Premium',
    shortDescription: 'The classic Mumbai-style crunchy mixture',
    description: 'Our Bombay Mix brings the vibrant street food flavors of Mumbai to your home. A perfect blend of sev, flattened rice, nuts, and spices — each handful is a delightful explosion of textures and flavors. Ideal for parties, gifting, or everyday snacking.',
    ingredients: 'Gram flour, rice flakes, peanuts, cashews, raisins, sev, vegetable oil, spices',
    price: 150,
    offerPrice: 129,
    category: categoryMap['Mixture'],
    stock: 100,
    weight: '500g',
    isFeatured: true,
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600'],
    tags: ['bombay mix', 'mixture', 'party snack'],
    ratings: 4.8,
    numReviews: 312,
    nutritionInfo: { calories: '545 kcal', protein: '15g', carbs: '58g', fat: '29g', fiber: '6g', sodium: '780mg' },
  },
  {
    name: 'Delhi Chaat Mixture',
    shortDescription: 'Tangy, spicy mixture inspired by Delhi street chaat',
    description: 'Inspired by the iconic chaat flavors of Old Delhi, this mixture combines tangy amchur, spicy red chilli, and aromatic spices with a crunchy blend of puffed lotus seeds, sev, and peanuts. It\'s a burst of Delhi-style street food flavors in every bite.',
    ingredients: 'Puffed lotus seeds, sev, peanuts, dried mango powder, chaat masala, red chilli, salt',
    price: 130,
    category: categoryMap['Mixture'],
    stock: 85,
    weight: '300g',
    isNew: true,
    images: ['https://images.unsplash.com/photo-1606491048802-8342506d6471?w=600'],
    tags: ['chaat', 'delhi', 'tangy', 'mixture'],
    ratings: 4.4,
    numReviews: 76,
    nutritionInfo: { calories: '500 kcal', protein: '14g', carbs: '57g', fat: '24g', fiber: '7g', sodium: '860mg' },
  },
  {
    name: 'Masala Potato Chips',
    shortDescription: 'Thin-cut chips with our signature masala blend',
    description: 'Sliced thin for maximum crunch and seasoned with our proprietary masala blend, these potato chips are an indulgence you\'ll want to share — but probably won\'t! Made from select potatoes for consistent texture and taste.',
    ingredients: 'Potatoes, sunflower oil, masala seasoning (salt, red chilli, chaat masala, dried mango powder)',
    price: 70,
    offerPrice: 59,
    category: categoryMap['Chips'],
    stock: 250,
    weight: '150g',
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600'],
    tags: ['chips', 'potato', 'masala', 'crispy'],
    ratings: 4.6,
    numReviews: 421,
    nutritionInfo: { calories: '560 kcal', protein: '7g', carbs: '62g', fat: '30g', fiber: '3g', sodium: '720mg' },
  },
  {
    name: 'Baked Multigrain Chips',
    shortDescription: 'Healthy baked chips — guilt-free munching',
    description: 'Our Baked Multigrain Chips are the perfect answer to guilt-free snacking. Made from a blend of whole wheat, oats, and corn, baked (not fried) to a satisfying crisp. Less than 30% fat compared to regular chips, with no artificial colors or preservatives.',
    ingredients: 'Whole wheat flour, oats, corn, sunflower oil (minimal), salt, herbs',
    price: 90,
    category: categoryMap['Diet Namkeen'],
    stock: 160,
    weight: '200g',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1474440692490-2e83ae13ba29?w=600'],
    tags: ['baked', 'multigrain', 'healthy', 'diet'],
    ratings: 4.2,
    numReviews: 88,
    nutritionInfo: { calories: '380 kcal', protein: '10g', carbs: '65g', fat: '9g', fiber: '8g', sodium: '480mg' },
  },
  {
    name: 'Makhana Roasted Classic',
    shortDescription: 'Lotus seeds roasted to perfection — light and healthy',
    description: 'Makhana (fox nuts/lotus seeds) are a superfood snack that has been treasured in Indian cuisine for centuries. Our roasted makhana is lightly seasoned with rock salt and ghee — low in fat, high in protein, and absolutely delicious.',
    ingredients: 'Fox nuts (makhana), ghee, rock salt, black pepper',
    price: 180,
    offerPrice: 149,
    category: categoryMap['Healthy Snacks'],
    stock: 90,
    weight: '100g',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1574484284002-952d92456975?w=600'],
    tags: ['makhana', 'fox nuts', 'healthy', 'protein'],
    ratings: 4.9,
    numReviews: 267,
    nutritionInfo: { calories: '347 kcal', protein: '9.7g', carbs: '76g', fat: '0.1g', fiber: '14.5g', sodium: '210mg' },
  },
  {
    name: 'Stevia Sweetened Kaju Namkeen',
    shortDescription: 'Sugar-free cashew namkeen sweetened with stevia',
    description: 'Specially crafted for health-conscious individuals and diabetics, our Stevia Sweetened Kaju Namkeen uses natural stevia as a sweetener instead of sugar. Packed with cashews, it delivers a satisfying, slightly sweet and savory flavor.',
    ingredients: 'Cashews, chickpea flour, stevia extract, rock salt, pepper, ghee',
    price: 220,
    category: categoryMap['Sugar Free Snacks'],
    stock: 60,
    weight: '150g',
    isNew: true,
    images: ['https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=600'],
    tags: ['sugar free', 'cashew', 'diabetic friendly', 'stevia'],
    ratings: 4.3,
    numReviews: 45,
    nutritionInfo: { calories: '520 kcal', protein: '18g', carbs: '35g', fat: '34g', fiber: '3g', sodium: '320mg' },
  },
  {
    name: 'Mathri Crispy Classic',
    shortDescription: 'Flaky, crispy mathri — a timeless tea-time snack',
    description: 'Mathri is the quintessential North Indian tea-time snack. Our mathri is made with whole wheat flour, ghee, and carom seeds, baked to a golden, flaky perfection. Each piece is hand-rolled for authenticity and consistency.',
    ingredients: 'Whole wheat flour, ghee, carom seeds (ajwain), salt, black pepper',
    price: 100,
    offerPrice: 85,
    category: categoryMap['Traditional Snacks'],
    stock: 130,
    weight: '300g',
    isBestSeller: true,
    images: ['https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600'],
    tags: ['mathri', 'traditional', 'tea snack', 'ajwain'],
    ratings: 4.7,
    numReviews: 198,
    nutritionInfo: { calories: '450 kcal', protein: '9g', carbs: '58g', fat: '20g', fiber: '5g', sodium: '680mg' },
  },
  {
    name: 'Khakhra Masala',
    shortDescription: 'Crispy Gujarati khakhra with bold masala coating',
    description: 'Khakhra is a beloved Gujarati snack — ultra-thin flatbreads roasted until crispy and then coated with a vibrant masala. Our version uses whole wheat with a special masala blend for a snack that\'s both tasty and relatively light.',
    ingredients: 'Whole wheat flour, oil, salt, turmeric, red chilli, ajwain, masala coating',
    price: 115,
    category: categoryMap['Traditional Snacks'],
    stock: 110,
    weight: '200g',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1551218372-a8789b81b253?w=600'],
    tags: ['khakhra', 'gujarati', 'traditional', 'wheat'],
    ratings: 4.5,
    numReviews: 134,
    nutritionInfo: { calories: '420 kcal', protein: '11g', carbs: '62g', fat: '14g', fiber: '6g', sodium: '590mg' },
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Coupon.deleteMany(),
    ]);

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@namkeenstore.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
      phone: '9999999999',
    });

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'Test@123456',
      role: 'user',
      phone: '8888888888',
    });

    console.log('👤 Created users');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log('📂 Created categories');

    // Create products
    const productData = getProducts(categoryMap);
    await Product.insertMany(productData);

    console.log('📦 Created products');

    // Create coupons
    await Coupon.insertMany([
      {
        code: 'WELCOME10',
        description: 'Welcome offer - 10% off on first order',
        discountType: 'percentage',
        discountValue: 10,
        maxDiscountAmount: 100,
        minOrderAmount: 200,
        usageLimit: 1000,
        userLimit: 1,
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'FLAT50',
        description: 'Flat ₹50 off on orders above ₹500',
        discountType: 'fixed',
        discountValue: 50,
        minOrderAmount: 500,
        usageLimit: 500,
        isActive: true,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'DIWALI20',
        description: 'Diwali special - 20% off',
        discountType: 'percentage',
        discountValue: 20,
        maxDiscountAmount: 200,
        minOrderAmount: 300,
        usageLimit: 200,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log('🎟️  Created coupons');

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Admin: admin@namkeenstore.com');
    console.log('🔑 Password: Admin@123456');
    console.log('📧 Test User: user@test.com');
    console.log('🔑 Password: Test@123456');
    console.log('🎟️  Coupons: WELCOME10, FLAT50, DIWALI20');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
