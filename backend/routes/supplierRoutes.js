const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.post('/add', supplierController.addSupplier);
router.get('/list', supplierController.getSuppliers);
router.put('/edit/:id', supplierController.updateSupplier);
router.delete('/delete/:id', supplierController.deleteSupplier);
router.post('/purchase', supplierController.addPurchase);
router.post('/payment', supplierController.addPayment);
router.get('/details/:id', supplierController.getSupplierDetails);

module.exports = router;