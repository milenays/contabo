const axios = require('axios');
const Product = require('../models/productModel');
const Brand = require('../models/brandModel');
const Category = require('../models/categoryModel');
const Integration = require('../models/integrationModel');

const TRENDYOL_API_URL = 'https://api.trendyol.com/sapigw/suppliers';

const fetchTrendyolProducts = async (req, res) => {
  try {
    const { integrationId } = req.params;
    const integration = await Integration.findById(integrationId);

    if (!integration) {
      return res.status(400).json({ message: 'Integration not found' });
    }

    let page = 0;
    let hasMore = true;
    let allProducts = [];

    while (hasMore) {
      const response = await axios.get(`${TRENDYOL_API_URL}/${integration.sellerId}/products`, {
        params: {
          page,
          size: 200,
          approved: true
        },
        headers: {
          'Authorization': `Basic ${Buffer.from(`${integration.apiKey}:${integration.apiSecret}`).toString('base64')}`,
          'User-Agent': 'Stockie App'
        }
      });

      const products = response.data.content;
      allProducts = [...allProducts, ...products];

      if (products.length < 200) {
        hasMore = false;
      } else {
        page++;
      }
    }

    for (const product of allProducts) {
      try {
        // Check and save brand
        let brand = await Brand.findOne({ name: product.brand });
        if (!brand) {
          brand = new Brand({ name: product.brand });
          await brand.save();
          console.log('Brand saved:', brand);
        } else {
          console.log('Brand already exists:', brand);
        }

        // Check and save category
        let category = await Category.findOne({ name: product.categoryName });
        if (!category) {
          category = new Category({ name: product.categoryName });
          await category.save();
          console.log('Category saved:', category);
        } else {
          console.log('Category already exists:', category);
        }

        // Check and save product
        let existingProduct = await Product.findOne({ productCode: product.productCode });
        if (!existingProduct) {
          const newProduct = new Product({
            productName: product.title,
            stockCode: product.productCode || 'N/A',
            barcode: product.barcode,
            brand: brand._id,
            category: category._id,
            weight: product.dimensionalWeight,
            description: product.description,
            marketPrice: product.listPrice,
            salePrice: product.salePrice,
            stock: product.quantity,
            fakeStock: 0,
            criticalStock: 0,
            warehouseShelfCode: '',
            warehouseAreaCode: '',
            images: product.images.map(image => image.url)
          });
          await newProduct.save();
          console.log('Product saved:', newProduct);
        } else {
          console.log('Product already exists:', existingProduct);
        }
      } catch (innerError) {
        console.error('Error processing product:', product, innerError);
      }
    }

    res.status(200).json({ message: `${allProducts.length} products fetched and saved successfully` });
  } catch (error) {
    console.error('Error fetching products from Trendyol:', error);
    res.status(500).json({ message: 'Error fetching products from Trendyol' });
  }
};

module.exports = {
  fetchTrendyolProducts,
};