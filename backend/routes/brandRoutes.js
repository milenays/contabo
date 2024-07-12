const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

router.get('/list', brandController.getBrands);
router.post('/add', brandController.addBrand);
router.put('/edit/:id', brandController.updateBrand);
router.delete('/delete/:id', brandController.deleteBrand);
router.get('/trendyol-brands', brandController.getTrendyolBrands);
router.get('/trendyol-brands/:brandId', brandController.getTrendyolBrandById);
router.post('/update-trendyol-brands', brandController.updateTrendyolBrands);

module.exports = router;