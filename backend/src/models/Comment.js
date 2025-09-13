import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true, maxlength: 500 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 }
}, { timestamps: true });

// Update likes count when likes array changes
commentSchema.pre('save', function(next) {
  this.likesCount = this.likes.length;
  next();
});

export default mongoose.model('Comment', commentSchema);
