import mongoose from 'mongoose';

const marketplaceItemSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 2000 },
  category: { 
    type: String, 
    enum: ['textbooks', 'electronics', 'furniture', 'clothing', 'services', 'other'], 
    required: true 
  },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  condition: { type: String, enum: ['new', 'like_new', 'good', 'fair', 'poor'], default: 'good' },
  images: [{ type: String }],
  location: { type: String, maxlength: 200 },
  contactInfo: { type: String, maxlength: 200 },
  isAvailable: { type: Boolean, default: true },
  isSold: { type: Boolean, default: false },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  soldAt: { type: Date },
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  viewsCount: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
  tags: [{ type: String, maxlength: 50 }],
  negotiable: { type: Boolean, default: false },
  deliveryAvailable: { type: Boolean, default: false }
}, { timestamps: true });

// Update counts when arrays change
marketplaceItemSchema.pre('save', function(next) {
  this.viewsCount = this.views.length;
  this.likesCount = this.likes.length;
  next();
});

// Indexes for efficient querying
marketplaceItemSchema.index({ seller: 1, isAvailable: 1 });
marketplaceItemSchema.index({ category: 1, isAvailable: 1 });
marketplaceItemSchema.index({ price: 1, isAvailable: 1 });
marketplaceItemSchema.index({ createdAt: -1 });

export default mongoose.model('MarketplaceItem', marketplaceItemSchema);
