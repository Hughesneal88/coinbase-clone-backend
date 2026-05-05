const express = require('express');
const router = express.Router();
const {
  getAllCryptos,
  getGainers,
  getNewListings,
  createCrypto,
} = require('../controllers/crypto.controller');

// Specific sub-routes must be defined before the generic /:id-style routes
router.get('/gainers', getGainers);
router.get('/new', getNewListings);
router.get('/', getAllCryptos);
router.post('/', createCrypto);

module.exports = router;
