const express = require('express');
const upload = require('../middlewares/imageUpload');
const { uploadImageHandler } = require('../controllers/imageController');
const router = express.Router();

router.post('/upload', upload.single('image'), uploadImageHandler);

module.exports = router;
