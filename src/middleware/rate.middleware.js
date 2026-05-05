const rateLimit = require('express-rate-limit');

/**
 * Strict limiter for authentication endpoints (register / login).
 * Helps prevent brute-force and credential-stuffing attacks.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
});

/**
 * General limiter for data endpoints.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
});

/**
 * Very strict limiter for public sync endpoints.
 * Prevents abuse and protects upstream providers (CoinGecko) and your DB.
 */
const syncLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many sync requests. Please try again later.',
  },
});

module.exports = { authLimiter, apiLimiter, syncLimiter };
