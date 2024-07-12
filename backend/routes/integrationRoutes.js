const express = require('express');
const { getIntegrations, saveIntegration, deleteIntegration } = require('../controllers/integrationController');
const { fetchTrendyolProducts } = require('../controllers/fetchTyProductsController');

const router = express.Router();

router.get('/', getIntegrations);
router.post('/save', saveIntegration);
router.get('/fetch-trendyol-products', fetchTrendyolProducts);
router.delete('/:id', deleteIntegration);
router.get('/fetch-trendyol-products/:integrationId', fetchTrendyolProducts);

module.exports = router;
