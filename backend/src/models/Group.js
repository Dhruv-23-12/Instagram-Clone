import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 1000 },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  membersCount: { type: Number, default: 0 },
  category: { 
    type: String, 
    enum: ['study', 'sports', 'cultural', 'academic', 'hobby', 'professional', 'other'], 
    default: 'other' 
  },
  privacy: { type: String, enum: ['public', 'private', 'restricted'], default: 'public' },
  avatarUrl: { type: String },
  coverUrl: { type: String },
  rules: [{ type: String, maxlength: 200 }],
  tags: [{ type: String, maxlength: 50 }],
  isActive: { type: Boolean, default: true },
  joinRequests: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    requestedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  }],
  settings: {
    allowMemberPosts: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    allowInvites: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Update members count when members array changes
groupSchema.pre('save', function(next) {
  this.membersCount = this.members.length;
  next();
});

// Indexes for efficient querying
groupSchema.index({ category: 1, privacy: 1 });
groupSchema.index({ creator: 1, isActive: 1 });
groupSchema.index({ members: 1, isActive: 1 });

export default mongoose.model('Group', groupSchema);
