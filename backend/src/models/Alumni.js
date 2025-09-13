import mongoose from 'mongoose';

const alumniSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  graduationYear: { type: Number, required: true },
  degree: { type: String, required: true, maxlength: 100 },
  department: { type: String, required: true, maxlength: 100 },
  currentJob: {
    company: { type: String, maxlength: 200 },
    position: { type: String, maxlength: 200 },
    location: { type: String, maxlength: 100 },
    industry: { type: String, maxlength: 100 }
  },
  achievements: [{
    title: { type: String, required: true },
    description: { type: String },
    year: { type: Number },
    category: { type: String, enum: ['academic', 'professional', 'personal', 'other'] }
  }],
  socialImpact: {
    volunteerWork: [{ type: String }],
    mentoring: { type: Boolean, default: false },
    donations: { type: Number, default: 0 }
  },
  contactPreferences: {
    allowMentoring: { type: Boolean, default: false },
    allowJobReferrals: { type: Boolean, default: false },
    allowNetworking: { type: Boolean, default: true },
    showContactInfo: { type: Boolean, default: false }
  },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },
  verifiedAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Indexes
alumniSchema.index({ graduationYear: 1, department: 1 });
alumniSchema.index({ verificationStatus: 1 });
alumniSchema.index({ 'currentJob.company': 1 });

export default mongoose.model('Alumni', alumniSchema);
