const express = require('express');
const router = express.Router();
const {
  applyJob,
  getStudentApplications,
  getJobApplicants,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, isStudent, isRecruiter } = require('../middleware/authMiddleware');

// @route   POST /api/applications/apply (Student applies for job)
router.post('/apply', protect, isStudent, applyJob);

// @route   GET /api/applications/student (Student views their submitted applications)
router.get('/student', protect, isStudent, getStudentApplications);

// @route   GET /api/applications/job/:jobId (Recruiter views applicants for a job post)
router.get('/job/:jobId', protect, isRecruiter, getJobApplicants);

// @route   PUT /api/applications/:id/status (Recruiter updates application status)
router.put('/:id/status', protect, isRecruiter, updateApplicationStatus);

module.exports = router;
