const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { getProducts } = require('../controllers/productController');

router.post('/upload-image', upload.single('image'), productController.uploadImageHandler);
router.get('/brands/list', productController.getBrands);
router.get('/categories/list', productController.getCategories);
router.post('/upload-excel', productController.uploadExcel);
router.get('/download-template', productController.getTemplate);
router.post('/', productController.addProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/', getProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
