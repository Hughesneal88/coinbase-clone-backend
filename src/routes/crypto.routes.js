const express = require('express');
const router = express.Router();
const {
  getAllCryptos,
  getGainers,
  getNewListings,
  createCrypto,
} = require('../controllers/crypto.controller');
const { apiLimiter } = require('../middleware/rate.middleware');

// Specific sub-routes must be defined before the generic /:id-style routes
router.get('/gainers', apiLimiter, getGainers);
router.get('/new', apiLimiter, getNewListings);
router.get('/', apiLimiter, getAllCryptos);
router.post('/', apiLimiter, createCrypto);

module.exports = router;
