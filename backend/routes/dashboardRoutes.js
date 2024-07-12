const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const Customer = require('../models/customerModel');
const Product = require('../models/productModel');
const Supplier = require('../models/supplierModel');

// Get dashboard data
router.get('/', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const totalCustomers = await Customer.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalSuppliers = await Supplier.countDocuments({});

    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5);

    res.json({
      totalOrders,
      totalCustomers,
      totalProducts,
      totalSuppliers,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
