import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  question: { type: String, required: true, maxlength: 500 },
  options: [{
    text: { type: String, required: true, maxlength: 200 },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    votesCount: { type: Number, default: 0 }
  }],
  totalVotes: { type: Number, default: 0 },
  expiresAt: { type: Date },
  isActive: { type: Boolean, default: true },
  allowMultipleVotes: { type: Boolean, default: false },
  showResults: { type: Boolean, default: true }
}, { timestamps: true });

// Update vote counts
pollSchema.pre('save', function(next) {
  this.options.forEach(option => {
    option.votesCount = option.votes.length;
  });
  this.totalVotes = this.options.reduce((sum, option) => sum + option.votesCount, 0);
  next();
});

// Indexes
pollSchema.index({ post: 1 });
pollSchema.index({ expiresAt: 1, isActive: 1 });

export default mongoose.model('Poll', pollSchema);
