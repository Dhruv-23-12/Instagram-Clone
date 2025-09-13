import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, maxlength: 20 },
  name: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 1000 },
  department: { type: String, required: true, maxlength: 100 },
  credits: { type: Number, required: true, min: 1, max: 10 },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  semester: { type: String, enum: ['1', '2', '3', '4', '5', '6', '7', '8'], required: true },
  year: { type: Number, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  studentsCount: { type: Number, default: 0 },
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
  materials: [{ 
    title: String,
    url: String,
    type: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Update students count
courseSchema.pre('save', function(next) {
  this.studentsCount = this.students.length;
  next();
});

// Indexes
courseSchema.index({ department: 1, semester: 1 });
courseSchema.index({ instructor: 1, isActive: 1 });

export default mongoose.model('Course', courseSchema);
