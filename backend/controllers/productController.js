const multer = require('multer');
const Product = require('../models/productModel');
const Brand = require('../models/brandModel');
const Category = require('../models/categoryModel');
const { v4: uuidv4 } = require('uuid');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler');

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

const uploadExcel = async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const products = XLSX.utils.sheet_to_json(sheet);

    for (const productData of products) {
      if (!productData.brand || !productData.category) {
        continue; // Boş olanları atla
      }

      let brand = await Brand.findOne({ name: productData.brand });
      if (!brand) {
        brand = new Brand({ name: productData.brand });
        await brand.save();
      }

      let category = await Category.findOne({ name: productData.category });
      if (!category) {
        category = new Category({ name: productData.category });
        await category.save();
      }

      const product = new Product({
        uniqueId: uuidv4(),
        productName: productData.productName,
        stockCode: productData.stockCode,
        barcode: productData.barcode,
        brand: brand._id,
        category: category._id,
        weight: productData.weight,
        description: productData.description,
        marketPrice: productData.marketPrice,
        salePrice: productData.salePrice,
        purchasePrice: productData.purchasePrice,
        stock: productData.stock,
        fakeStock: productData.fakeStock,
        criticalStock: productData.criticalStock,
        images: productData.images ? productData.images.split(',') : [], // Assume images are comma-separated URLs
      });

      await product.save();
    }

    res.status(201).json({ message: 'Products uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading products' });
  }
};

const getTemplate = (req, res) => {
  const data = [
    [
      'productName', 'stockCode', 'barcode', 'brand', 'category', 'weight', 'description',
      'marketPrice', 'salePrice', 'purchasePrice', 'stock', 'fakeStock', 'criticalStock', 'images'
    ],
    [
      'Sample Product', 'SC123', '1234567890123', 'Sample Brand', 'Sample Category', '1', 'Sample Description',
      '100', '80', '60', '10', '10', '5', 'http://example.com/image1.jpg,http://example.com/image2.jpg'
    ]
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');

  const filePath = path.join(__dirname, '../uploads/template.xlsx');
  XLSX.writeFile(wb, filePath);

  res.download(filePath, 'template.xlsx', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error generating template');
    }
    fs.unlinkSync(filePath); // Delete the file after sending it to the client
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

const upload = multer({ storage });

const uploadImageHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: imageUrl,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: err.message,
    });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('brand', 'name')
      .populate('category', 'name');
    console.log(products); // Log ekleyin
    res.json(products);
  } catch (error) {
    console.error(error); // Hataları loglayın
    res.status(500).json({ message: 'Error fetching products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('brand', 'name')
      .populate('category', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  const {
    productName,
    stockCode,
    barcode,
    brand,
    category,
    weight,
    description,
    marketPrice,
    salePrice,
    purchasePrice,
    stock,
    fakeStock,
    criticalStock,
    warehouseShelfCode,
    warehouseAreaCode,
    images,
    channelPricing,
    integrationInfo,
  } = req.body;

  if (
    !productName ||
    !stockCode ||
    !barcode ||
    !brand ||
    !category ||
    !weight ||
    !description ||
    !marketPrice ||
    !salePrice ||
    !purchasePrice ||
    !stock
  ) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    const newProduct = new Product({
      uniqueId: uuidv4(),
      productName,
      stockCode,
      barcode,
      brand,
      category,
      weight,
      description,
      marketPrice,
      salePrice,
      purchasePrice,
      stock,
      fakeStock,
      criticalStock,
      warehouseShelfCode,
      warehouseAreaCode,
      images,
      channelPricing,
      integrationInfo,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('brand', 'name')
      .populate('category', 'name');
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getBrands,
  getCategories,
  uploadImageHandler,
  uploadExcel,
  getTemplate,
  getProducts,
  getProductById,
};
