const mongoose = require('mongoose');

const lineSchema = mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  orderLineId: { type: String, required: true },
  salesCampaignId: { type: String },
  productCode: { type: String },
  merchantSku: { type: String },
  productSize: { type: String },
  productColor: { type: String },
  productCategory: { type: String },
  barcode: { type: String },
});

const addressSchema = mongoose.Schema({
  fullName: { type: String },
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  district: { type: String },
  postalCode: { type: String },
});

const orderSchema = mongoose.Schema({
  orderNumber: { type: String, required: true },
  customerFirstName: { type: String, required: true },
  customerLastName: { type: String, required: true },
  customerEmail: { type: String },
  customerPhone: { type: String },
  totalPrice: { type: Number, required: true },
  status: { type: String, required: true },
  lines: [lineSchema],
  shipmentAddress: { type: String },
  shipmentCity: { type: String },
  shipmentDistrict: { type: String },
  shipmentAddressType: { type: String },
  shipmentPostalCode: { type: String },
  cargoCompany: { type: String },
  cargoNumber: { type: String },
  packageTracking: { type: String },
  cargoBarcode: { type: String },
  shipmentPackageId: { type: String, required: true },
  invoiceAddress: addressSchema,
  grossAmount: { type: Number },
  totalDiscount: { type: Number },
  deliveryType: { type: String },
  estimatedDeliveryStartDate: { type: Date },
  estimatedDeliveryEndDate: { type: Date },
  orderDate: { type: Date, required: true },
  paymentType: { type: String },
  packageNumber: { type: String },
  cargoTrackingNumber: { type: String },
  cargoTrackingLink: { type: String },
  cargoSenderNumber: { type: String },
  deliveryAddressType: { type: String },
  trendyolStatus: { type: String },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;