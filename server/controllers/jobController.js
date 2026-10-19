const mongoose = require('mongoose');
const Job = require('../models/Job');
const Application = require('../models/Application');

/**
 * @desc    Create a new job post
 * @route   POST /api/jobs
 * @access  Private (Recruiter only)
 */
const createJob = async (req, res, next) => {
  try {
    const { title, company, location, stipend, jobType, skillsRequired, description } = req.body;

    if (!title || !company || !location || !stipend || !description) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    // Standardize skills array if passed as a string or array
    let parsedSkills = [];
    if (Array.isArray(skillsRequired)) {
      parsedSkills = skillsRequired.map((s) => s.trim()).filter(Boolean);
    } else if (typeof skillsRequired === 'string') {
      parsedSkills = skillsRequired.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (parsedSkills.length === 0) {
      res.status(400);
      throw new Error('Please provide at least one required skill');
    }

    const job = await Job.create({
      title,
      company: company || req.user.companyName || 'Unknown Company',
      location,
      stipend,
      jobType: jobType || 'Internship',
      skillsRequired: parsedSkills,
      description,
      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all jobs with search and filter parameters
 * @route   GET /api/jobs
 * @access  Public
 */
const getJobs = async (req, res, next) => {
  try {
    const { search, location, jobType } = req.query;

    const query = {};

    // Filter by search string (matches title, company, or skills)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skillsRequired: { $elemMatch: { $regex: search, $options: 'i' } } },
      ];
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by jobType (Full-time / Internship)
    if (jobType) {
      query.jobType = jobType;
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email companyName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get details of a single job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid Job ID format');
    }

    const job = await Job.findById(id).populate('postedBy', 'name email companyName bio');

    if (!job) {
      res.status(404);
      throw new Error('Job listing not found');
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all jobs posted by the logged-in recruiter
 * @route   GET /api/jobs/recruiter/my-jobs
 * @access  Private (Recruiter only)
 */
const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a job post by recruiter
 * @route   DELETE /api/jobs/:id
 * @access  Private (Recruiter only)
 */
const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid Job ID format');
    }

    const job = await Job.findById(id);

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    // Ensure the recruiter owns this job post
    if (job.postedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this job listing');
    }

    // Delete job and all associated applications
    await Job.findByIdAndDelete(id);
    await Application.deleteMany({ jobId: id });

    res.status(200).json({
      success: true,
      message: 'Job posting and associated applications removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  getRecruiterJobs,
  deleteJob,
};
