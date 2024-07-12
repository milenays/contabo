const Category = require('../models/categoryModel');
const TyCategory = require('../models/tycategoryModel');
const TyCategoryAttribute = require('../models/tycategoryAttributeModel');

exports.getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const categories = await Category.find()
      .select('name description trendyolCategoryId trendyolCategoryName')
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCategories = await Category.countDocuments();

    res.json({
      categories,
      currentPage: page,
      totalPages: Math.ceil(totalCategories / limit),
      totalCategories
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name, description, trendyolCategoryId, trendyolAttributes } = req.body;
    
    let trendyolCategoryName = null;
    if (trendyolCategoryId) {
      const tyCategory = await TyCategory.findOne({ categoryId: trendyolCategoryId });
      trendyolCategoryName = tyCategory ? tyCategory.name : null;
    }

    const category = new Category({
      name,
      description,
      trendyolCategoryId,
      trendyolCategoryName,
      trendyolAttributes
    });

    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error adding category', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, trendyolCategoryId, trendyolAttributes } = req.body;
    
    let trendyolCategoryName = null;
    if (trendyolCategoryId) {
      const tyCategory = await TyCategory.findOne({ categoryId: trendyolCategoryId });
      trendyolCategoryName = tyCategory ? tyCategory.name : null;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        trendyolCategoryId,
        trendyolCategoryName,
        trendyolAttributes
      },
      { new: true }
    );
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error updating category', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTrendyolCategories = async (req, res) => {
  try {
    const tyCategories = await TyCategory.find();
    res.json(tyCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTrendyolCategoryAttributes = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    // Önce kategori modelinde attribute'ları kontrol et
    const category = await Category.findOne({ trendyolCategoryId: categoryId });
    
    if (category && category.trendyolAttributes && category.trendyolAttributes.length > 0) {
      // Kategori modelinde attribute'lar varsa, onları döndür
      return res.json(category.trendyolAttributes);
    }
    
    // Kategori modelinde attribute yoksa, tyCategoryAttributes'dan çek
    const tyAttributes = await TyCategoryAttribute.find({ categoryId });
    res.json(tyAttributes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryWithTrendyolDetails = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    let trendyolCategory = null;
    let trendyolAttributes = [];

    if (category.trendyolCategoryId) {
      trendyolCategory = await TyCategory.findOne({ categoryId: category.trendyolCategoryId });
      trendyolAttributes = await TyCategoryAttribute.find({ categoryId: category.trendyolCategoryId });
    }

    res.json({
      category,
      trendyolCategory,
      trendyolAttributes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchTrendyolCategories = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const tyCategories = await TyCategory.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalCategories = await TyCategory.countDocuments(query);

    res.json({
      categories: tyCategories,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCategories / limit),
      totalCategories
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching Trendyol categories', error: error.message });
  }
};

exports.getTrendyolCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const tyCategory = await TyCategory.findOne({ categoryId: id });
    
    if (!tyCategory) {
      return res.status(404).json({ message: 'Trendyol category not found' });
    }

    res.json(tyCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};