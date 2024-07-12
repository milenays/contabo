const express = require('express');
const { fetchTyBrands, fetchTyCategories, fetchTyCategoryAttributes } = require('../controllers/FetchTyBrCtControllers');

const router = express.Router();

router.post('/fetch-brands', fetchTyBrands);
router.post('/fetch-categories', fetchTyCategories);
router.post('/fetch-category-attributes', fetchTyCategoryAttributes);

module.exports = router;