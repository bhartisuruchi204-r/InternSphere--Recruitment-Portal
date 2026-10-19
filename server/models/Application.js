const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeUrl: {
      type: String,
      required: [true, 'Please provide a resume URL or document link'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Rejected'],
      default: 'Applied',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications by the same student for the same job posting
applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
