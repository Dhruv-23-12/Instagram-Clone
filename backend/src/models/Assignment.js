import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 2000 },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date, required: true },
  maxMarks: { type: Number, required: true, min: 1 },
  attachments: [{ 
    name: String, 
    url: String, 
    type: String 
  }],
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    attachments: [{ 
      name: String, 
      url: String, 
      type: String 
    }],
    submittedAt: { type: Date, default: Date.now },
    marks: Number,
    feedback: String,
    isGraded: { type: Boolean, default: false }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Indexes
assignmentSchema.index({ course: 1, dueDate: 1 });
assignmentSchema.index({ instructor: 1, isActive: 1 });

export default mongoose.model('Assignment', assignmentSchema);
