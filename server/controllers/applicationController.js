const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');

/**
 * @desc    Apply to a job post
 * @route   POST /api/applications/apply
 * @access  Private (Student only)
 */
const applyJob = async (req, res, next) => {
  try {
    const { jobId, resumeUrl } = req.body;

    if (!jobId) {
      res.status(400);
      throw new Error('Please provide a jobId');
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400);
      throw new Error('Invalid Job ID format');
    }

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job listing not found');
    }

    // Use student's profile resumeUrl if not passed explicitly in body
    const finalResumeUrl = resumeUrl || req.user.resumeUrl;
    if (!finalResumeUrl) {
      res.status(400);
      throw new Error('Please provide a resume URL or upload a resume in your profile');
    }

    // Check if student has already applied for this job
    const existingApplication = await Application.findOne({
      jobId,
      studentId: req.user._id,
    });

    if (existingApplication) {
      res.status(400);
      throw new Error('You have already applied for this position');
    }

    // Create new application
    const application = await Application.create({
      jobId,
      studentId: req.user._id,
      resumeUrl: finalResumeUrl,
      status: 'Applied',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applications submitted by the logged-in student
 * @route   GET /api/applications/student
 * @access  Private (Student only)
 */
const getStudentApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate({
        path: 'jobId',
        select: 'title company location stipend jobType skillsRequired postedBy',
        populate: {
          path: 'postedBy',
          select: 'name email companyName',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applicants for a specific job post
 * @route   GET /api/applications/job/:jobId
 * @access  Private (Recruiter only)
 */
const getJobApplicants = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400);
      throw new Error('Invalid Job ID format');
    }

    // Check if job exists and belongs to logged-in recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job listing not found');
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view applicants for this job post');
    }

    const applications = await Application.find({ jobId })
      .populate('studentId', 'name email bio resumeUrl createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobTitle: job.title,
      company: job.company,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update application status ('Shortlisted' / 'Rejected' / 'Applied')
 * @route   PUT /api/applications/:id/status
 * @access  Private (Recruiter only)
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid Application ID format');
    }

    if (!status || !['Applied', 'Shortlisted', 'Rejected'].includes(status)) {
      res.status(400);
      throw new Error("Invalid status. Must be 'Applied', 'Shortlisted', or 'Rejected'");
    }

    const application = await Application.findById(id).populate('jobId');

    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }

    // Ensure logged-in recruiter owns the job associated with this application
    if (application.jobId.postedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update applicant status for this job');
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Application status updated to '${status}' successfully`,
      application,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyJob,
  getStudentApplications,
  getJobApplicants,
  updateApplicationStatus,
};
