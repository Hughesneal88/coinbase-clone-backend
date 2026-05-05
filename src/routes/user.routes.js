const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { apiLimiter } = require('../middleware/rate.middleware');

router.get('/profile', apiLimiter, protect, getProfile);

module.exports = router;
