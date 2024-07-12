const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  trendyolCategoryId: {
    type: Number,
    default: null
  },
  trendyolCategoryName: {
    type: String,
    default: null
  },
  trendyolAttributes: [{
    attributeId: Number,
    name: String,
    required: Boolean,
    allowCustom: Boolean,
    varianter: Boolean,
    slicer: Boolean,
    attributeValues: [{
      id: Number,
      name: String
    }],
    value: String // Eklenen alan
  }]
});

module.exports = mongoose.model('Category', categorySchema);