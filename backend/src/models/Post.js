import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  caption: { type: String, trim: true, default: '' },
  content: { type: String, trim: true, default: '' },
  media: [{
    type: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: true },
    thumbnail: { type: String },
    duration: { type: Number }, // for videos in seconds
    size: { type: Number } // file size in bytes
  }],
  postType: { type: String, enum: ['text', 'image', 'video', 'carousel', 'poll'], default: 'image' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  sharesCount: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true },
  location: { type: String, maxlength: 200 },
  tags: [{ type: String, maxlength: 50 }],
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPinned: { type: Boolean, default: false },
  scheduledAt: { type: Date },
  isScheduled: { type: Boolean, default: false }
}, { timestamps: true });

// Update likes count when likes array changes
postSchema.pre('save', function(next) {
  this.likesCount = this.likes.length;
  next();
});

export default mongoose.model('Post', postSchema);
