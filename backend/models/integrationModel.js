const mongoose = require('mongoose');

const integrationSchema = mongoose.Schema({
  platform: { type: String, required: true },
  name: { type: String, required: true },
  apiKey: { type: String, required: true },
  apiSecret: { type: String, required: true },
  sellerId: { type: String, required: true },
  status: { type: String, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Integration', integrationSchema);
