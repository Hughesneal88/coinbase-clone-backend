const express = require('express');
const router = express.Router();
const {
  getAllCryptos,
  getGainers,
  getNewListings,
  createCrypto,
} = require('../controllers/crypto.controller');
const { apiLimiter } = require('../middleware/rate.middleware');

// Sub-routes must be registered before the root '/' route to avoid conflicts
router.get('/gainers', apiLimiter, getGainers);
router.get('/new', apiLimiter, getNewListings);
router.get('/', apiLimiter, getAllCryptos);
router.post('/', apiLimiter, createCrypto);

module.exports = router;
