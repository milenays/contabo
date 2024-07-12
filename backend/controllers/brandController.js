const Brand = require('../models/brandModel');
const TyBrand = require('../models/tybrandModel');

exports.getBrands = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const aggregationPipeline = [
      {
        $lookup: {
          from: 'tybrands',
          localField: 'trendyolBrandId',
          foreignField: 'brandId',
          as: 'trendyolBrand'
        }
      },
      {
        $unwind: {
          path: '$trendyolBrand',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          trendyolBrandId: 1,
          trendyolBrandName: {
            $ifNull: ['$trendyolBrand.name', 'Not matched']
          }
        }
      },
      { $skip: skip },
      { $limit: limit }
    ];

    const brands = await Brand.aggregate(aggregationPipeline);
    const totalBrands = await Brand.countDocuments();

    res.json({
      brands,
      currentPage: page,
      totalPages: Math.ceil(totalBrands / limit),
      totalBrands
    });
  } catch (err) {
    console.error('Error fetching brands:', err);
    res.status(500).json({ error: 'Failed to fetch brands', details: err.message });
  }
};

exports.addBrand = async (req, res) => {
  const { name, description, trendyolBrandId } = req.body;
  try {
    let trendyolBrandName = null;
    if (trendyolBrandId) {
      const tyBrand = await TyBrand.findOne({ brandId: trendyolBrandId });
      trendyolBrandName = tyBrand ? tyBrand.name : null;
    }
    const newBrand = new Brand({ name, description, trendyolBrandId, trendyolBrandName });
    const savedBrand = await newBrand.save();
    res.status(201).json(savedBrand);
  } catch (err) {
    console.error('Error adding brand:', err);
    res.status(400).json({ error: 'Failed to add brand' });
  }
};

exports.updateBrand = async (req, res) => {
  const { id } = req.params;
  const { name, description, trendyolBrandId } = req.body;
  try {
    let trendyolBrandName = null;
    if (trendyolBrandId) {
      const tyBrand = await TyBrand.findOne({ brandId: trendyolBrandId });
      trendyolBrandName = tyBrand ? tyBrand.name : null;
    }
    const updatedBrand = await Brand.findByIdAndUpdate(
      id, 
      { name, description, trendyolBrandId, trendyolBrandName }, 
      { new: true }
    );
    res.json(updatedBrand);
  } catch (err) {
    console.error('Error updating brand:', err);
    res.status(400).json({ error: 'Failed to update brand' });
  }
};

exports.deleteBrand = async (req, res) => {
  const { id } = req.params;
  try {
    await Brand.findByIdAndDelete(id);
    res.json({ message: 'Brand deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete brand' });
  }
};

exports.getTrendyolBrands = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const brands = await TyBrand.find(query)
      .select('brandId name')
      .skip(skip)
      .limit(parseInt(limit));

    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Trendyol brands' });
  }
};

exports.getTrendyolBrandById = async (req, res) => {
  try {
    const { brandId } = req.params;
    const numericBrandId = parseInt(brandId, 10);

    if (isNaN(numericBrandId)) {
      return res.status(400).json({ error: 'Invalid brandId. Must be a number.' });
    }

    const brand = await TyBrand.findOne({ brandId: numericBrandId }).select('brandId name');
    
    if (!brand) {
      return res.status(404).json({ error: 'Trendyol brand not found' });
    }
    
    res.json(brand);
  } catch (err) {
    console.error('Error fetching Trendyol brand:', err);
    res.status(500).json({ error: 'Failed to fetch Trendyol brand', details: err.message });
  }
};

exports.updateTrendyolBrands = async (req, res) => {
  try {
    const tyBrands = await TyBrand.find().lean();

    for (const tyBrand of tyBrands) {
      await Brand.findOneAndUpdate(
        { trendyolBrandId: tyBrand.brandId },
        { 
          $set: { 
            trendyolBrandName: tyBrand.name,
            lastUpdated: new Date()
          }
        },
        { upsert: false }
      );
    }

    res.json({ message: 'Trendyol brands updated successfully' });
  } catch (err) {
    console.error('Error updating Trendyol brands:', err);
    res.status(500).json({ error: 'Failed to update Trendyol brands', details: err.message });
  }
};