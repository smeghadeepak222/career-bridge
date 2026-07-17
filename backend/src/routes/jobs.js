const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  deleteJob,
} = require('../controllers/jobController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');

// Public / student browsing
router.get('/', getAllJobs);

// Recruiter-only: must come before /:id so "mine" isn't treated as an id
router.get('/recruiter/mine', authenticate, authorize('recruiter'), getMyJobs);
router.post('/', authenticate, authorize('recruiter'), createJob);
router.delete('/:id', authenticate, authorize('recruiter'), deleteJob);

router.get('/:id', getJobById);

module.exports = router;
