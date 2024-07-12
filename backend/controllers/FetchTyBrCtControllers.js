const axios = require('axios');
const mongoose = require('mongoose');
const TyBrand = require('../models/tybrandModel');
const TyCategory = require('../models/tycategoryModel');
const TyCategoryAttribute = require('../models/tycategoryAttributeModel');
const Integration = require('../models/integrationModel');

const fetchTyBrands = async (req, res) => {
    try {
        const integration = await Integration.findOne({ platform: 'Trendyol' });
        if (!integration) {
            return res.status(400).json({ message: 'Trendyol integration not found' });
        }

        let page = 0;
        let hasMore = true;
        const batchSize = 200;
        let retryCount = 0;
        const maxRetries = 3;

        while (hasMore && retryCount < maxRetries) {
            try {
                const response = await axios.get(`https://api.trendyol.com/sapigw/brands?page=${page}&size=${batchSize}`, {
                    headers: {
                        'Authorization': `Basic ${Buffer.from(`${integration.apiKey}:${integration.apiSecret}`).toString('base64')}`
                    },
                    timeout: 30000
                });

                const brands = response.data.brands;
                if (brands.length === 0) {
                    hasMore = false;
                } else {
                    await TyBrand.bulkWrite(
                        brands.map((brand) => ({
                            updateOne: {
                                filter: { brandId: brand.id },
                                update: { $set: { name: brand.name } },
                                upsert: true
                            }
                        }))
                    );

                    page++;
                    if (page % 5 === 0) {
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    }
                }
                retryCount = 0;
            } catch (error) {
                console.error(`Error fetching brands on page ${page}:`, error.message);
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }

        if (retryCount >= maxRetries) {
            return res.status(500).json({ message: 'Max retries reached while fetching brands' });
        }

        res.json({ message: 'Brands fetched and saved successfully' });
    } catch (error) {
        console.error('Error in fetchTyBrands:', error);
        res.status(500).json({ message: 'Error fetching brands', error: error.message });
    }
};

const fetchTyCategories = async (req, res) => {
    try {
        const integration = await Integration.findOne({ platform: 'Trendyol' });
        if (!integration) {
            return res.status(400).json({ message: 'Trendyol integration not found' });
        }

        console.log('TyCategory model:', TyCategory);

        let retryCount = 0;
        const maxRetries = 3;

        const fetchCategories = async () => {
            const response = await axios.get('https://api.trendyol.com/sapigw/product-categories', {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${integration.apiKey}:${integration.apiSecret}`).toString('base64')}`
                },
                timeout: 30000
            });
            return response.data;
        };

        const saveCategoryRecursive = async (category, parentId = null) => {
            try {
                console.log(`Attempting to save category: ${category.id} - ${category.name}`);
                const result = await TyCategory.findOneAndUpdate(
                    { categoryId: category.id },
                    { 
                        name: category.name, 
                        parentId: parentId 
                    },
                    { upsert: true, new: true }
                );
                console.log(`Saved category result:`, result);

                if (Array.isArray(category.subCategories)) {
                    for (const subCategory of category.subCategories) {
                        await saveCategoryRecursive(subCategory, category.id);
                    }
                }
            } catch (error) {
                console.error(`Error saving category ${category.id}:`, error);
                throw error;
            }
        };

        while (retryCount < maxRetries) {
            try {
                const categoriesData = await fetchCategories();
                console.log('Fetched categories:', JSON.stringify(categoriesData).slice(0, 200) + '...'); // Log first 200 characters

                if (!categoriesData.categories || !Array.isArray(categoriesData.categories)) {
                    throw new Error('Fetched data does not contain an array of categories');
                }

                let savedCount = 0;
                for (const category of categoriesData.categories) {
                    await saveCategoryRecursive(category);
                    savedCount++;
                }
                console.log(`Categories saved successfully. Total categories saved: ${savedCount}`);
                
                // Verify if categories were actually saved
                const totalSavedCategories = await TyCategory.countDocuments();
                console.log(`Total categories in database: ${totalSavedCategories}`);

                break;
            } catch (error) {
                console.error(`Error fetching or saving categories (attempt ${retryCount + 1}):`, error.message);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                }
                retryCount++;
                if (retryCount < maxRetries) {
                    console.log(`Retrying in 10 seconds...`);
                    await new Promise(resolve => setTimeout(resolve, 10000));
                }
            }
        }

        if (retryCount >= maxRetries) {
            return res.status(500).json({ message: 'Max retries reached while fetching categories' });
        }

        const finalCategoryCount = await TyCategory.countDocuments();
        res.json({ message: 'Categories fetched and saved successfully', categoriesSaved: finalCategoryCount });
    } catch (error) {
        console.error('Error in fetchTyCategories:', error);
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

const fetchTyCategoryAttributes = async (req, res) => {
    try {
        const integration = await Integration.findOne({ platform: 'Trendyol' });
        if (!integration) {
            return res.status(400).json({ message: 'Trendyol integration not found' });
        }

        const categories = await TyCategory.find({});
        let processedCount = 0;
        const totalCategories = categories.length;

        for (const category of categories) {
            let retryCount = 0;
            const maxRetries = 3;

            while (retryCount < maxRetries) {
                try {
                    const response = await axios.get(`https://api.trendyol.com/sapigw/product-categories/${category.categoryId}/attributes`, {
                        headers: {
                            'Authorization': `Basic ${Buffer.from(`${integration.apiKey}:${integration.apiSecret}`).toString('base64')}`
                        },
                        timeout: 30000
                    });

                    const attributes = response.data.categoryAttributes;

                    for (const attr of attributes) {
                        await TyCategoryAttribute.findOneAndUpdate(
                            { categoryId: category.categoryId, attributeId: attr.attribute.id },
                            {
                                name: attr.attribute.name,
                                required: attr.required,
                                allowCustom: attr.allowCustom,
                                varianter: attr.varianter,
                                slicer: attr.slicer,
                                attributeValues: attr.attributeValues
                            },
                            { upsert: true, new: true }
                        );
                    }

                    processedCount++;
                    if (processedCount % 10 === 0) {
                        console.log(`Processed ${processedCount}/${totalCategories} categories`);
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    }

                    break;
                } catch (error) {
                    console.error(`Error fetching attributes for category ${category.categoryId} (attempt ${retryCount + 1}):`, error.message);
                    retryCount++;
                    if (retryCount < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, 10000));
                    }
                }
            }

            if (retryCount >= maxRetries) {
                console.error(`Failed to fetch attributes for category ${category.categoryId} after ${maxRetries} attempts`);
            }
        }

        res.json({ message: 'Category attributes fetched and saved successfully' });
    } catch (error) {
        console.error('Error in fetchTyCategoryAttributes:', error);
        res.status(500).json({ message: 'Error fetching category attributes', error: error.message });
    }
};

module.exports = {
    fetchTyBrands,
    fetchTyCategories,
    fetchTyCategoryAttributes
};