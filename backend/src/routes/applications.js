const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');

// Student routes
router.post('/:jobId', authenticate, authorize('student'), applyToJob);
router.get('/mine', authenticate, authorize('student'), getMyApplications);

// Recruiter routes
router.get('/job/:jobId', authenticate, authorize('recruiter'), getApplicantsForJob);
router.patch('/:id/status', authenticate, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
