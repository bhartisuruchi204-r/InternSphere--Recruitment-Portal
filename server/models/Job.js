const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
      trim: true,
    },
    stipend: {
      type: String,
      required: [true, 'Please provide stipend or salary details'],
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Internship'],
      default: 'Internship',
      required: true,
    },
    skillsRequired: {
      type: [String],
      required: [true, 'Please specify at least one skill required'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'Skills required must contain at least one skill',
      },
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
