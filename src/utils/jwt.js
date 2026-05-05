const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for the given payload.
 * @param {object} payload - Data to encode (e.g. { id, email })
 * @returns {string} signed JWT string
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Verify a JWT and return the decoded payload.
 * @param {string} token
 * @returns {object} decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Parse a duration string (e.g. "7d", "24h", "30m") to milliseconds.
 * Falls back to 7 days if the value is unrecognised.
 * @param {string} str
 * @returns {number} duration in ms
 */
const parseDurationMs = (str) => {
  if (!str) return 7 * 24 * 60 * 60 * 1000;
  const match = String(str).match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers = { s: 1000, m: 60 * 1000, h: 3600 * 1000, d: 86400 * 1000 };
  return value * multipliers[unit];
};

/**
 * Build cookie options appropriate for the current environment.
 * maxAge is derived from JWT_EXPIRES_IN to stay in sync with token lifetime.
 * @returns {object} cookie options
 */
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: parseDurationMs(process.env.JWT_EXPIRES_IN),
});

module.exports = { generateToken, verifyToken, cookieOptions };
