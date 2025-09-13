import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true, maxlength: 2000 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { 
    type: String, 
    enum: ['academic', 'administrative', 'event', 'general', 'urgent'], 
    default: 'general' 
  },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  targetAudience: { 
    type: String, 
    enum: ['all', 'students', 'faculty', 'staff', 'specific'], 
    default: 'all' 
  },
  targetGroups: [{ type: String }], // For specific groups/departments
  attachments: [{ 
    name: String, 
    url: String, 
    type: String 
  }],
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, index: { expireAfterSeconds: 0 } },
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  viewsCount: { type: Number, default: 0 },
  tags: [{ type: String, maxlength: 50 }]
}, { timestamps: true });

// Update views count when views array changes
announcementSchema.pre('save', function(next) {
  this.viewsCount = this.views.length;
  next();
});

// Indexes for efficient querying
announcementSchema.index({ isActive: 1, createdAt: -1 });
announcementSchema.index({ category: 1, priority: 1 });
announcementSchema.index({ targetAudience: 1, isActive: 1 });

export default mongoose.model('Announcement', announcementSchema);
