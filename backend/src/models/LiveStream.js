import mongoose from 'mongoose';

const liveStreamSchema = new mongoose.Schema({
  streamer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 1000 },
  category: { 
    type: String, 
    enum: ['academic', 'entertainment', 'sports', 'gaming', 'music', 'talk', 'other'], 
    default: 'other' 
  },
  streamKey: { type: String, required: true, unique: true },
  streamUrl: { type: String },
  thumbnailUrl: { type: String },
  isLive: { type: Boolean, default: false },
  startedAt: { type: Date },
  endedAt: { type: Date },
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  viewersCount: { type: Number, default: 0 },
  maxViewers: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, maxlength: 500 },
    timestamp: { type: Date, default: Date.now }
  }],
  isPublic: { type: Boolean, default: true },
  tags: [{ type: String, maxlength: 50 }]
}, { timestamps: true });

// Update counts when arrays change
liveStreamSchema.pre('save', function(next) {
  this.viewersCount = this.viewers.length;
  this.likesCount = this.likes.length;
  
  if (this.viewersCount > this.maxViewers) {
    this.maxViewers = this.viewersCount;
  }
  
  next();
});

// Indexes for efficient querying
liveStreamSchema.index({ streamer: 1, isLive: 1 });
liveStreamSchema.index({ isLive: 1, createdAt: -1 });
liveStreamSchema.index({ category: 1, isLive: 1 });

export default mongoose.model('LiveStream', liveStreamSchema);
