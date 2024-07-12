const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');

router.post('/add', async (req, res) => {
  const { firstName, lastName, email, phone, address } = req.body;
  try {
    const newCustomer = new Customer({ firstName, lastName, email, phone, address });
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/list', async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.json(customers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, address } = req.body;
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(id, { firstName, lastName, email, phone, address }, { new: true });
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Customer.findByIdAndDelete(id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
