const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const purchaseSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  items: [purchaseItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  receiptNumber: String,
  invoiceNumber: String,
});

module.exports = mongoose.model('Purchase', purchaseSchema);