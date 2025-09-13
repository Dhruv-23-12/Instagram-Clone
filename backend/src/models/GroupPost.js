import mongoose from 'mongoose';

const groupPostSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true, index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 2000 },
  imageUrl: { type: String },
  attachments: [{ 
    name: String, 
    url: String, 
    type: String 
  }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
  isAnnouncement: { type: Boolean, default: false }
}, { timestamps: true });

// Update likes count when likes array changes
groupPostSchema.pre('save', function(next) {
  this.likesCount = this.likes.length;
  next();
});

// Indexes for efficient querying
groupPostSchema.index({ group: 1, createdAt: -1 });
groupPostSchema.index({ author: 1, createdAt: -1 });
groupPostSchema.index({ isPinned: 1, isAnnouncement: 1 });

export default mongoose.model('GroupPost', groupPostSchema);
