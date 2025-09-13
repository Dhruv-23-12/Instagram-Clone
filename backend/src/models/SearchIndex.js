import mongoose from 'mongoose';

const searchIndexSchema = new mongoose.Schema({
  type: { type: String, enum: ['user', 'post', 'group', 'event', 'announcement'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  content: { type: String },
  tags: [{ type: String }],
  category: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  popularity: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Text index for search
searchIndexSchema.index({ 
  title: 'text', 
  content: 'text', 
  tags: 'text' 
});

// Other indexes
searchIndexSchema.index({ type: 1, popularity: -1 });
searchIndexSchema.index({ itemId: 1, type: 1 }, { unique: true });

export default mongoose.model('SearchIndex', searchIndexSchema);
