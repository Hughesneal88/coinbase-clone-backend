const fetch = require('node-fetch');
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

    // Pre-validate with type checks before hitting the DB
    if (!name || !symbol || !image) {
      return res.status(400).json({
        success: false,
        message: 'name, symbol, and image are required strings.',
      });
    }
    if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'price must be a non-negative number.',
      });
    }
    if (change24h === undefined || change24h === null || isNaN(Number(change24h))) {
      return res.status(400).json({
        success: false,
        message: 'change24h must be a number.',
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

/**
 * POST /crypto/sync
 * Sync top market assets from CoinGecko into MongoDB.
 *
 * Default: top 100 by market cap (USD).
 * Optional query params:
 *  - perPage (1..250)
 *  - page (>=1)
 */
const syncFromCoinGecko = async (req, res, next) => {
  try {
    const perPage = Number(req.query.perPage) || 100;
    const page = Number(req.query.page) || 1;

    const safePerPage = Math.min(Math.max(perPage, 1), 250);
    const safePage = Math.max(page, 1);

    const url =
      `https://api.coingecko.com/api/v3/coins/markets` +
      `?vs_currency=usd&order=market_cap_desc&per_page=${safePerPage}&page=${safePage}` +
      `&sparkline=false&price_change_percentage=24h`;

    const headers = {
      accept: 'application/json',
    };

    // If you have a CoinGecko API key (Demo/Pro), include it via env var.
    // CoinGecko Demo keys use the 'x-cg-demo-api-key' header.
    if (process.env.COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
    }

    const cgRes = await fetch(url, { headers });

    if (!cgRes.ok) {
      return res.status(502).json({
        success: false,
        message: `CoinGecko request failed: ${cgRes.status} ${cgRes.statusText}`,
      });
    }

    const coins = await cgRes.json();

    let created = 0;
    let updated = 0;

    for (const coin of coins) {
      const coingeckoId = coin?.id;
      const name = coin?.name;
      const symbol = coin?.symbol ? String(coin.symbol).toUpperCase() : undefined;
      const image = coin?.image;
      const price = Number(coin?.current_price);
      const change24h = Number(coin?.price_change_percentage_24h ?? 0);

      // Skip malformed entries
      if (!coingeckoId || !name || !symbol || !image || Number.isNaN(price)) continue;

      const existed = await Crypto.exists({ coingeckoId });

      await Crypto.findOneAndUpdate(
        { coingeckoId },
        {
          $set: {
            coingeckoId,
            name,
            symbol,
            image,
            price,
            change24h,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      if (existed) updated += 1;
      else created += 1;
    }

    return res.status(200).json({
      success: true,
      message: 'Market sync completed.',
      data: {
        created,
        updated,
        total: coins.length,
        perPage: safePerPage,
        page: safePage,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCryptos,
  getGainers,
  getNewListings,
  createCrypto,
  syncFromCoinGecko,
};
