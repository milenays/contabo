const Order = require('../models/orderModel');
const Integration = require('../models/integrationModel');
const axios = require('axios');
const asyncHandler = require('express-async-handler');

// Tüm siparişleri al
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
});

// Sipariş detaylarını al
const getOrderDetail = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// Sipariş oluştur
const createOrder = asyncHandler(async (req, res) => {
  const { customerName, orderItems, totalPrice } = req.body;
  const order = new Order({
    customerName,
    orderItems,
    totalPrice,
  });
  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// Siparişi güncelle
const updateOrder = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// Siparişi sil
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    await order.remove();
    res.json({ message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// orderControllers.js dosyasında

const updateOrderStatusToPicking = asyncHandler(async (req, res) => {
  try {
    const { orderNumber } = req.body;
    console.log('Order Number:', orderNumber);

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      console.error('Order not found');
      return res.status(404).json({ message: 'Order not found' });
    }

    const integration = await Integration.findOne({ platform: 'Trendyol' });

    if (!integration) {
      console.error('Trendyol integration not configured');
      return res.status(400).json({ message: 'Trendyol integration not configured' });
    }

    const updatePayload = {
      lines: order.lines.map(line => ({
        lineId: parseInt(line.orderLineId),
        quantity: line.quantity
      })),
      params: {},
      status: 'Picking'
    };

    console.log('Update Payload:', updatePayload);

    try {
      const trendyolResponse = await axios.put(
        `https://api.trendyol.com/sapigw/suppliers/${integration.sellerId}/shipment-packages/${order.shipmentPackageId}`,
        updatePayload,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${integration.apiKey}:${integration.apiSecret}`).toString('base64')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Trendyol Response:', trendyolResponse.data);

      order.status = 'Picking';
      await order.save();

      res.json({ message: 'Order status updated to Picking' });
    } catch (error) {
      console.error('Failed to update order status to Picking:', error.response ? error.response.data : error.message);
      res.status(500).json({ message: 'Failed to update order status to Picking' });
    }
  } catch (error) {
    console.error('Error in updateOrderStatusToPicking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const changeTyCargo = asyncHandler(async (req, res) => {
  try {
    const { shipmentPackageId } = req.params;
    const { cargoProvider } = req.body;

    const integration = await Integration.findOne({ platform: 'Trendyol' });

    if (!integration) {
      return res.status(400).json({ message: 'Trendyol integration not configured' });
    }

    const updatePayload = {
      cargoProvider: cargoProvider
    };

    try {
      const trendyolResponse = await axios.put(
        `https://api.trendyol.com/sapigw/suppliers/${integration.sellerId}/shipment-packages/${shipmentPackageId}/cargo-providers`,
        updatePayload,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${integration.apiKey}:${integration.apiSecret}`).toString('base64')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Trendyol Response:', trendyolResponse.data);

      res.json({ message: 'Cargo provider update request sent to Trendyol successfully' });
    } catch (error) {
      console.error('Failed to update cargo provider on Trendyol:', error.response ? error.response.data : error.message);
      res.status(500).json({ message: 'Failed to update cargo provider on Trendyol' });
    }
  } catch (error) {
    console.error('Error in changeTyCargo:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = {
  getAllOrders,
  getOrderDetail,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatusToPicking,
  changeTyCargo,
};
