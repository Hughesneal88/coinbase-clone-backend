# coinbase-clone-backend

Node.js + Express + MongoDB (Mongoose) REST API for the Coinbase clone project.  
Provides JWT-based authentication (HTTP-only cookies) and cryptocurrency data endpoints.

---

## Live API (Base URL)

Use this base URL when calling the deployed API:

- **`https://coinbase-clone-backend-xpvg.onrender.com`**

All endpoint paths below are relative to the base URL.

---

## Prerequisites

- Node.js ≥ 16
- MongoDB running locally (or a MongoDB Atlas URI)

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env
# Edit .env with your values (MONGO_URI, JWT_SECRET, etc.)

# 3. Start the development server (hot-reload via nodemon)
npm run dev

# 4. Or start in production mode
npm start
```

---

## Environment Variables (`.env`)

| Variable         | Description                        | Example                              |
|------------------|------------------------------------|--------------------------------------|
| `PORT`           | Port the server listens on         | `5000`                               |
| `MONGO_URI`      | MongoDB connection string          | `mongodb://127.0.0.1:27017/coinbase` |
| `JWT_SECRET`     | Secret key for signing JWTs        | `a_long_random_string`               |
| `JWT_EXPIRES_IN` | JWT expiry duration                | `7d`                                 |
| `CLIENT_ORIGIN`  | Allowed CORS origin (frontend URL) | `http://localhost:3000`              |
| `NODE_ENV`       | `development` or `production`      | `development`                        |

---

## Project Structure

```
src/
  config/
    db.js                  # MongoDB connection
  controllers/
    auth.controller.js     # register / login / logout
    user.controller.js     # profile
    crypto.controller.js   # crypto CRUD
  middleware/
    auth.middleware.js     # JWT cookie guard (protect)
    error.middleware.js    # central error handler + 404
  models/
    User.js                # Mongoose User schema
    Crypto.js              # Mongoose Crypto schema
  routes/
    auth.routes.js
    user.routes.js
    crypto.routes.js
  utils/
    jwt.js                 # generateToken / verifyToken / cookieOptions
  app.js                   # Express app configuration
  server.js                # Entry point
```

---

## API Endpoints

All responses follow the shape: `{ success, message, data? }`.

### Auth

| Method | Path        | Body                        | Description                    |
|--------|-------------|-----------------------------|--------------------------------|
| POST   | `/register` | `{ name, email, password }` | Create account, set JWT cookie |
| POST   | `/login`    | `{ email, password }`       | Login, set JWT cookie          |
| POST   | `/logout`   | —                           | Clear JWT cookie               |

**Examples (Live API)**

- `POST https://coinbase-clone-backend-xpvg.onrender.com/register`
- `POST https://coinbase-clone-backend-xpvg.onrender.com/login`
- `POST https://coinbase-clone-backend-xpvg.onrender.com/logout`

### User (Protected – requires valid JWT cookie)

| Method | Path       | Description               |
|--------|------------|---------------------------|
| GET    | `/profile` | Return authenticated user |

**Example (Live API)**

- `GET https://coinbase-clone-backend-xpvg.onrender.com/profile`

### Crypto

| Method | Path              | Body                                        | Description                                     |
|--------|-------------------|---------------------------------------------|-------------------------------------------------|
| GET    | `/crypto`         | —                                           | All crypto assets                                |
| GET    | `/crypto/gainers` | —                                           | Sorted by `change24h` (highest first)            |
| GET    | `/crypto/new`     | —                                           | Sorted by `createdAt` (newest first)             |
| POST   | `/crypto`         | `{ name, symbol, price, image, change24h }` | Create a new crypto asset                        |
| POST   | `/crypto/sync`    | —                                           | Sync top market assets from CoinGecko (top 100) |

**Examples (Live API)**

- `GET  https://coinbase-clone-backend-xpvg.onrender.com/crypto`
- `GET  https://coinbase-clone-backend-xpvg.onrender.com/crypto/gainers`
- `GET  https://coinbase-clone-backend-xpvg.onrender.com/crypto/new`
- `POST https://coinbase-clone-backend-xpvg.onrender.com/crypto`
- `POST https://coinbase-clone-backend-xpvg.onrender.com/crypto/sync`

---

## Frontend Integration

When consuming this API from a browser, include credentials so cookies are sent:

**Axios**

```js
axios.defaults.withCredentials = true;
```

**Fetch**

```js
fetch(url, { credentials: 'include' })
```
