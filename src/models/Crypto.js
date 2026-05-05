const mongoose = require('mongoose');

const CryptoSchema = new mongoose.Schema(
  {
    // CoinGecko coin id (e.g. "bitcoin"). Used for reliable market-data syncing.
    coingeckoId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    symbol: {
      type: String,
      required: [true, 'Symbol is required'],
      uppercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    change24h: {
      type: Number,
      required: [true, '24h change is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crypto', CryptoSchema);
