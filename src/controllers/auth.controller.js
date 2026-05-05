const User = require('../models/User');
const { generateToken, cookieOptions } = require('../utils/jwt');

/**
 * POST /register
 * Create a new user account.
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    // Check for existing email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with that email already exists.',
      });
    }

    // Create user (password is hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    // Issue JWT and set cookie
    const token = generateToken({ id: user._id, email: user.email });
    res.cookie('token', token, cookieOptions());

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /login
 * Authenticate an existing user.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Fetch user with password field (excluded by default via `select: false`)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Issue JWT and set cookie
    const token = generateToken({ id: user._id, email: user.email });
    res.cookie('token', token, cookieOptions());

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /logout
 * Clear the auth cookie.
 */
const logout = (req, res) => {
  const opts = cookieOptions();
  // maxAge of 0 ensures the cookie is deleted immediately
  res.clearCookie('token', { ...opts, maxAge: 0 });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

module.exports = { register, login, logout };
