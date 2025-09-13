import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  coverUrl: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 150 },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  postsCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['student', 'faculty', 'staff', 'admin'], default: 'student' },
  department: { type: String, maxlength: 100 },
  year: { type: String, maxlength: 20 },
  studentId: { type: String, maxlength: 20 },
  phone: { type: String, maxlength: 15 },
  location: { type: String, maxlength: 100 },
  website: { type: String, maxlength: 200 },
  socialLinks: {
    instagram: { type: String, maxlength: 100 },
    twitter: { type: String, maxlength: 100 },
    linkedin: { type: String, maxlength: 100 }
  },
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      likes: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
      follows: { type: Boolean, default: true },
      events: { type: Boolean, default: true }
    },
    privacy: {
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false },
      showLocation: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true }
    }
  },
  achievements: [{
    title: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    earnedAt: { type: Date, default: Date.now }
  }],
  analytics: {
    profileViews: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    loginCount: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
