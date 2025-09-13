import mongoose from 'mongoose';

const campusResourceSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 200 },
  type: { 
    type: String, 
    enum: ['library', 'lab', 'classroom', 'auditorium', 'cafeteria', 'gym', 'parking', 'other'], 
    required: true 
  },
  location: { 
    building: { type: String, required: true },
    floor: { type: String },
    room: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  description: { type: String, maxlength: 1000 },
  capacity: { type: Number },
  amenities: [{ type: String }],
  availability: {
    monday: { start: String, end: String, isOpen: Boolean },
    tuesday: { start: String, end: String, isOpen: Boolean },
    wednesday: { start: String, end: String, isOpen: Boolean },
    thursday: { start: String, end: String, isOpen: Boolean },
    friday: { start: String, end: String, isOpen: Boolean },
    saturday: { start: String, end: String, isOpen: Boolean },
    sunday: { start: String, end: String, isOpen: Boolean }
  },
  contactInfo: {
    phone: { type: String, maxlength: 15 },
    email: { type: String, maxlength: 100 },
    manager: { type: String, maxlength: 100 }
  },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true },
  bookings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    purpose: { type: String, maxlength: 200 },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
    bookedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Indexes
campusResourceSchema.index({ type: 1, isActive: 1 });
campusResourceSchema.index({ 'location.building': 1 });
campusResourceSchema.index({ bookings: 1 });

export default mongoose.model('CampusResource', campusResourceSchema);
