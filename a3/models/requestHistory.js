// models/requestHistory.js
const mongoose = require('mongoose');

const requestHistorySchema = new mongoose.Schema({
  userRequest: { type: String, required: true },
  dataType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const RequestHistory = mongoose.model('RequestHistory', requestHistorySchema);

module.exports = RequestHistory;
    