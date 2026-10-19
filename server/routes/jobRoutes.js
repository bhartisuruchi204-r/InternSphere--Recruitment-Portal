const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  getRecruiterJobs,
  deleteJob,
} = require('../controllers/jobController');
const { protect, isRecruiter } = require('../middleware/authMiddleware');

// @route   POST /api/jobs (Create job - Recruiter only)
// @route   GET /api/jobs (Fetch all jobs with filters)
router
  .route('/')
  .post(protect, isRecruiter, createJob)
  .get(getJobs);

// @route   GET /api/jobs/recruiter/my-jobs (Fetch jobs posted by logged-in recruiter)
router.get('/recruiter/my-jobs', protect, isRecruiter, getRecruiterJobs);

// @route   GET /api/jobs/:id (Get single job detail)
// @route   DELETE /api/jobs/:id (Delete job - Recruiter only)
router
  .route('/:id')
  .get(getJobById)
  .delete(protect, isRecruiter, deleteJob);

module.exports = router;
