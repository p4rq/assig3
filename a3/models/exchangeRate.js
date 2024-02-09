// models/exchangeRate.js
const mongoose = require('mongoose');

const exchangeRateSchema = new mongoose.Schema({
  data: { type: mongoose.Schema.Types.Mixed },
  userRequest: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ExchangeRate', exchangeRateSchema);
