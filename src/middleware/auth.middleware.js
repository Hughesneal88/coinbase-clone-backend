const { verifyToken } = require('../utils/jwt');

/**
 * Auth middleware – reads JWT from HTTP-only cookie, verifies it,
 * and attaches the decoded payload to req.user.
 */
const protect = (req, res, next) => {
  const token = req.cookies && req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated. Please log in.',
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

module.exports = { protect };
