const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const cryptoRoutes = require('./routes/crypto.routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

// Render/other reverse proxies set X-Forwarded-For / X-Forwarded-Proto.
// Enable trust proxy so express-rate-limit can correctly identify clients.
app.set('trust proxy', 1);

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allow local dev and deployed frontend. In production, prefer setting CLIENT_ORIGIN.
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:3000',
  'https://coinbase-clone-hughesneal88.onrender.com',
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (no Origin header) like curl/Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
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
