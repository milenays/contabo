const axios = require('axios');
const Integration = require('../models/integrationModel');
const Order = require('../models/orderModel');
const TyAddress = require('../models/tyAddressesModel');

const TRENDYOL_API_URL = 'https://api.trendyol.com/sapigw/suppliers';

const fetchTrendyolOrders = async (req, res) => {
  try {
    const integration = await Integration.findOne({ platform: 'Trendyol' });

    if (!integration) {
      console.error('Trendyol integration not configured');
      return res.status(400).json({ message: 'Trendyol integration not configured' });
    }

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const startDate = twoWeeksAgo.getTime();
    const endDate = Date.now();

    const params = {
      startDate,
      endDate,
      orderByField: 'PackageLastModifiedDate',
      orderByDirection: 'DESC',
      size: 200,
      page: 0,
      status: 'Created,Picking,Invoiced,Shipped,Delivered,Cancelled,UnDelivered,Returned,Repack,UnSupplied'
    };

    let allOrders = [];
    let hasMoreOrders = true;

    while (hasMoreOrders) {
      console.log('Making request to Trendyol API with params:', params);

      const response = await axios.get(`${TRENDYOL_API_URL}/${integration.sellerId}/orders`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${integration.apiKey}:${integration.apiSecret}`).toString('base64')}`,
          'Content-Type': 'application/json'
        },
        params: params
      });

      const trendyolOrders = response.data.content;

      if (!Array.isArray(trendyolOrders)) {
        throw new Error('Expected an array but got: ' + JSON.stringify(trendyolOrders));
      }

      console.log('Fetched orders from Trendyol:', trendyolOrders);

      allOrders = [...allOrders, ...trendyolOrders];

      if (trendyolOrders.length < params.size) {
        hasMoreOrders = false;
      } else {
        params.page++;
      }
    }

    console.log('Total orders fetched:', allOrders.length);
    console.log('Order statuses:', allOrders.map(order => order.status));

    for (const trendyolOrder of allOrders) {
      const existingOrders = await Order.find({ orderNumber: trendyolOrder.orderNumber });
      
      const orderData = {
        orderNumber: trendyolOrder.orderNumber,
        customerFirstName: trendyolOrder.customerFirstName,
        customerLastName: trendyolOrder.customerLastName,
        totalPrice: trendyolOrder.totalPrice,
        status: mapTrendyolStatusToLocalStatus(trendyolOrder.status),
        lines: trendyolOrder.lines.map(line => ({
          productName: line.productName,
          quantity: line.quantity,
          unitPrice: line.price,
          orderLineId: line.id.toString(),
          barcode: line.barcode
        })),
        shipmentAddress: trendyolOrder.shipmentAddress.address1 || '',
        shipmentCity: trendyolOrder.shipmentAddress.city || '',
        shipmentDistrict: trendyolOrder.shipmentAddress.district || '',
        cargoCompany: trendyolOrder.cargoProviderName || '',
        cargoNumber: trendyolOrder.cargoSenderNumber || '',
        packageTracking: trendyolOrder.cargoTrackingLink || '',
        cargoBarcode: trendyolOrder.cargoTrackingNumber || '',
        shipmentPackageId: trendyolOrder.id.toString(),
        orderDate: new Date(trendyolOrder.orderDate),
        customerEmail: trendyolOrder.customerEmail,
        customerPhone: trendyolOrder.customerPhone,
        shipmentAddressType: trendyolOrder.shipmentAddress.addressType,
        shipmentPostalCode: trendyolOrder.shipmentAddress.postalCode,
        invoiceAddress: trendyolOrder.invoiceAddress ? {
          fullName: trendyolOrder.invoiceAddress.fullName,
          address1: trendyolOrder.invoiceAddress.address1,
          address2: trendyolOrder.invoiceAddress.address2,
          city: trendyolOrder.invoiceAddress.city,
          district: trendyolOrder.invoiceAddress.district,
          postalCode: trendyolOrder.invoiceAddress.postalCode,
        } : null,
        grossAmount: trendyolOrder.grossAmount,
        totalDiscount: trendyolOrder.totalDiscount,
        deliveryType: trendyolOrder.deliveryType,
        estimatedDeliveryStartDate: trendyolOrder.estimatedDeliveryStartDate ? new Date(trendyolOrder.estimatedDeliveryStartDate) : null,
        estimatedDeliveryEndDate: trendyolOrder.estimatedDeliveryEndDate ? new Date(trendyolOrder.estimatedDeliveryEndDate) : null,
      };

      const existingOrder = existingOrders.find(order => order.shipmentPackageId === trendyolOrder.id.toString());

      if (existingOrder) {
        // Mevcut siparişi güncelle
        await Order.findOneAndUpdate(
          { orderNumber: trendyolOrder.orderNumber, shipmentPackageId: trendyolOrder.id.toString() },
          orderData,
          { new: true }
        );
      } else {
        // Yeni sipariş oluştur
        const newOrder = new Order(orderData);
        await newOrder.save();
      }
    }

    res.json({ message: 'Orders fetched and saved to database' });
  } catch (error) {
    console.error('Error fetching orders from Trendyol:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to fetch orders from Trendyol' });
  }
};

const fetchAddresses = async (req, res) => {
  try {
    const integration = await Integration.findOne({ platform: 'Trendyol' });

    if (!integration) {
      return res.status(400).json({ message: 'Trendyol integration not configured' });
    }

    const response = await axios.get(`${TRENDYOL_API_URL}/${integration.sellerId}/addresses`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${integration.apiKey}:${integration.apiSecret}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });

    const addresses = response.data.supplierAddresses;

    // Veritabanındaki mevcut adresleri temizle
    await TyAddress.deleteMany({});

    // Yeni adresleri kaydet
    await TyAddress.insertMany(addresses);

    res.status(200).json({ message: 'Addresses fetched and saved successfully', count: addresses.length });
  } catch (error) {
    console.error('Error fetching addresses from Trendyol:', error);
    res.status(500).json({ message: 'Failed to fetch addresses from Trendyol', error: error.message });
  }
};

const sendProduct = async (req, res) => {
  try {
    const productData = req.body;
    // Trendyol API'sine ürün gönder
    const result = await trendyolApi.sendProduct(productData);
    res.status(200).json({ message: 'Product sent to Trendyol', result });
  } catch (error) {
    res.status(500).json({ message: 'Error sending product', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId, updateData } = req.body;
    // Trendyol API'sinde ürünü güncelle
    const result = await trendyolApi.updateProduct(productId, updateData);
    res.status(200).json({ message: 'Product updated on Trendyol', result });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

getAddresses = async (req, res) => {
  try {
      const addresses = await TyAddress.find({});
      res.status(200).json(addresses);
  } catch (error) {
      console.error('Error getting addresses from database:', error);
      res.status(500).json({ message: 'Failed to get addresses from database', error: error.message });
  }
};

const mapTrendyolStatusToLocalStatus = (trendyolStatus) => {
  switch (trendyolStatus) {
    case 'Created':
      return 'Yeni';
    case 'Picking':
      return 'Hazırlanıyor';
    case 'Invoiced':
      return 'Faturalandı';
    case 'Shipped':
      return 'Kargoda';
    case 'Delivered':
      return 'Teslim Edildi';
    case 'UnDelivered':
      return 'Teslim Problemi';
    case 'Cancelled':
      return 'İptal';
    case 'Returned':
      return 'İade Edildi';
    default:
      return 'Bilinmiyor';
  }
};

module.exports = {
  fetchTrendyolOrders,
  fetchAddresses,
  sendProduct,
  updateProduct,
  getAddresses,
};