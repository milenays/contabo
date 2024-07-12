const mongoose = require('mongoose');

const tyAddressSchema = new mongoose.Schema({
  id: Number,
  addressType: String,
  country: String,
  city: String,
  cityCode: Number,
  district: String,
  districtId: Number,
  postCode: String,
  address: String,
  returningAddress: Boolean,
  fullAddress: String,
  shipmentAddress: Boolean,
  invoiceAddress: Boolean,
  default: Boolean
});

module.exports = mongoose.model('TyAddress', tyAddressSchema);