const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/list', categoryController.getCategories);
router.post('/add', categoryController.addCategory);
router.put('/edit/:id', categoryController.updateCategory);
router.delete('/delete/:id', categoryController.deleteCategory);
router.get('/trendyol-categories', categoryController.getTrendyolCategories);
router.get('/trendyol-attributes/:categoryId', categoryController.getTrendyolCategoryAttributes);
router.get('/:id/with-trendyol-details', categoryController.getCategoryWithTrendyolDetails);
router.get('/search-trendyol-categories', categoryController.searchTrendyolCategories);
router.get('/trendyol-category/:id', categoryController.getTrendyolCategoryById);

module.exports = router;