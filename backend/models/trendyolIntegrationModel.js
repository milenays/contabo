const mongoose = require('mongoose');

const trendyolIntegrationSchema = new mongoose.Schema({
  apiKey: {
    type: String,
    required: true
  },
  apiSecret: {
    type: String,
    required: true
  },
  sellerId: {
    type: String,
    required: true
  }
});

const TrendyolIntegration = mongoose.model('TrendyolIntegration', trendyolIntegrationSchema);

module.exports = TrendyolIntegration;
