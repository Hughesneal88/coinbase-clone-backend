const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const cryptoRoutes = require('./routes/crypto.routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// ── Body / Cookie parsers ─────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/crypto', cryptoRoutes);

// ── 404 + error handling ──────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
