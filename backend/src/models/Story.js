import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  content: { type: String, required: true, maxlength: 500 },
  imageUrl: { type: String },
  videoUrl: { type: String },
  type: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  viewsCount: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Update views count when views array changes
storySchema.pre('save', function(next) {
  this.viewsCount = this.views.length;
  next();
});

// Index for efficient querying
storySchema.index({ author: 1, expiresAt: 1 });
storySchema.index({ isActive: 1, expiresAt: 1 });

export default mongoose.model('Story', storySchema);
