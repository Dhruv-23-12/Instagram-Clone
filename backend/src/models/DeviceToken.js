import mongoose from 'mongoose';

const deviceTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  platform: { type: String, enum: ['ios', 'android', 'web'], required: true },
  deviceId: { type: String },
  appVersion: { type: String },
  osVersion: { type: String },
  isActive: { type: Boolean, default: true },
  lastUsed: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
deviceTokenSchema.index({ user: 1, isActive: 1 });
deviceTokenSchema.index({ token: 1 }, { unique: true });

export default mongoose.model('DeviceToken', deviceTokenSchema);
