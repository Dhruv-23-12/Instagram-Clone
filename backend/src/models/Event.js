import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 2000 },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { 
    type: String, 
    enum: ['academic', 'sports', 'cultural', 'social', 'workshop', 'seminar', 'other'], 
    default: 'social' 
  },
  location: { type: String, required: true, maxlength: 200 },
  startDate: { type: Date, required: true, index: true },
  endDate: { type: Date, required: true },
  imageUrl: { type: String },
  maxAttendees: { type: Number, default: null },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attendeesCount: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true },
  isCancelled: { type: Boolean, default: false },
  tags: [{ type: String, maxlength: 50 }],
  requirements: { type: String, maxlength: 500 },
  contactInfo: { type: String, maxlength: 200 }
}, { timestamps: true });

// Update attendees count when attendees array changes
eventSchema.pre('save', function(next) {
  this.attendeesCount = this.attendees.length;
  next();
});

// Indexes for efficient querying
eventSchema.index({ startDate: 1, isPublic: 1 });
eventSchema.index({ category: 1, startDate: 1 });
eventSchema.index({ organizer: 1, startDate: 1 });

export default mongoose.model('Event', eventSchema);
