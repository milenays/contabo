const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model('Variant', variantSchema);
