const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authController');
const authenticate = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, getProfile);

module.exports = router;
