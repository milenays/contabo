const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  stockCode: { type: String, required: true },
  barcode: { type: String, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  weight: { type: Number },
  description: { type: String },
  marketPrice: { type: Number },
  salePrice: { type: Number },
  purchasePrice: { type: Number },
  stock: { type: Number },
  fakeStock: { type: Number },
  criticalStock: { type: Number },
  warehouseShelfCode: { type: String },
  warehouseAreaCode: { type: String },
  images: [{ type: String }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
