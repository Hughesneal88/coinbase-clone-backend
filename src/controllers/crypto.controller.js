const Crypto = require('../models/Crypto');

/**
 * GET /crypto
 * Return all crypto assets.
 */
const getAllCryptos = async (req, res, next) => {
  try {
    const cryptos = await Crypto.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Cryptos fetched successfully.',
      data: { cryptos },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /crypto/gainers
 * Return cryptos sorted by 24h change (highest first).
 */
const getGainers = async (req, res, next) => {
  try {
    const cryptos = await Crypto.find().sort({ change24h: -1 });

    res.status(200).json({
      success: true,
      message: 'Top gainers fetched successfully.',
      data: { cryptos },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /crypto/new
 * Return the most recently listed cryptos (limited to 20 entries).
 */
const getNewListings = async (req, res, next) => {
  try {
    const cryptos = await Crypto.find().sort({ createdAt: -1 }).limit(20);

    res.status(200).json({
      success: true,
      message: 'New listings fetched successfully.',
      data: { cryptos },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /crypto
 * Create a new crypto asset.
 */
const createCrypto = async (req, res, next) => {
  try {
    const { name, symbol, price, image, change24h } = req.body;

    if (!name || !symbol || price === undefined || !image || change24h === undefined) {
      return res.status(400).json({
        success: false,
        message: 'name, symbol, price, image, and change24h are all required.',
      });
    }

    const crypto = await Crypto.create({ name, symbol, price, image, change24h });

    res.status(201).json({
      success: true,
      message: 'Crypto created successfully.',
      data: { crypto },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCryptos, getGainers, getNewListings, createCrypto };
