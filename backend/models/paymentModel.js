const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: String,
  notes: String,
});

module.exports = mongoose.model('Payment', paymentSchema);