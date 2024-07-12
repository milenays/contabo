const express = require('express');
const { fetchTrendyolOrders, fetchAddresses, getAddresses, sendProduct, updateProduct } = require('../controllers/trendyolController');
const router = express.Router();

router.route('/orders').get(fetchTrendyolOrders);
router.route('/addresses').get(getAddresses);
router.route('/fetch-addresses').get(fetchAddresses); // Yeni eklenen satır
router.route('/product').post(sendProduct);
router.route('/product/:id').put(updateProduct);

module.exports = router;