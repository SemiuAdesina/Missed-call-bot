const mongoose = require("mongoose");

const smsLogSchema = new mongoose.Schema({
  to: String,
  message: String,
  status: String,
  timestamp: { type: Date, default: Date.now },
  type: String,
});

module.exports = mongoose.model("SMSLog", smsLogSchema);
