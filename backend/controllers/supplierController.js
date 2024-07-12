const Supplier = require('../models/supplierModel');
const Purchase = require('../models/purchaseModel');
const Payment = require('../models/paymentModel');

exports.addSupplier = async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    if (!name || !email || !phone || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newSupplier = new Supplier({ name, email, phone, address });
    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.json(suppliers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(id, { name, email, phone, address }, { new: true });
    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    await Supplier.findByIdAndDelete(id);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addPurchase = async (req, res) => {
    console.log('Received purchase data:', req.body);
    const { supplierId, items, totalAmount, receiptNumber, invoiceNumber, date } = req.body;
    try {
      if (!supplierId || !items || !totalAmount) {
        return res.status(400).json({ message: 'supplierId, items, and totalAmount are required' });
      }
      const purchase = new Purchase({
        supplier: supplierId,
        items,
        totalAmount,
        receiptNumber,
        invoiceNumber,
        date,
      });
      const savedPurchase = await purchase.save();
  
      // Update supplier's totalPurchaseAmount and balance
      await Supplier.findByIdAndUpdate(supplierId, {
        $inc: { totalPurchaseAmount: totalAmount, balance: totalAmount },
      });
  
      res.status(201).json(savedPurchase);
    } catch (error) {
      console.error('Error in addPurchase:', error);
      res.status(400).json({ message: error.message });
    }
  };

exports.addPayment = async (req, res) => {
  const { supplierId, amount, paymentMethod, notes } = req.body;
  try {
    const payment = new Payment({
      supplier: supplierId,
      amount,
      paymentMethod,
      notes,
    });
    const savedPayment = await payment.save();

    // Update supplier's totalPaymentAmount and balance
    await Supplier.findByIdAndUpdate(supplierId, {
      $inc: { totalPaymentAmount: amount, balance: -amount },
    });

    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSupplierDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const supplier = await Supplier.findById(id);
    const purchases = await Purchase.find({ supplier: id });
    const payments = await Payment.find({ supplier: id });
    res.json({ supplier, purchases, payments });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};