const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: [true, 'Description is required'] },
    shortDescription: { type: String },
    ingredients: { type: String },
    nutritionInfo: {
      calories: String,
      protein: String,
      carbs: String,
      fat: String,
      fiber: String,
      sodium: String,
    },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    offerPrice: { type: Number, min: 0 },
    discount: { type: Number, default: 0 }, // percentage
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, unique: true, sparse: true },
    weight: { type: String }, // e.g., "200g", "500g"
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    metaTitle: String,
    metaDescription: String,
    shelfLife: String, // e.g., "6 months"
    storage: String, // e.g., "Store in cool, dry place"
    brand: { type: String, default: 'Namkeen Store' },
    countryOfOrigin: { type: String, default: 'India' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for effective price
productSchema.virtual('effectivePrice').get(function () {
  return this.offerPrice || this.price;
});

// Virtual for discount percentage
productSchema.virtual('discountPercent').get(function () {
  if (this.offerPrice && this.price > this.offerPrice) {
    return Math.round(((this.price - this.offerPrice) / this.price) * 100);
  }
  return 0;
});

// Generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isBestSeller: 1 });

module.exports = mongoose.model('Product', productSchema);
