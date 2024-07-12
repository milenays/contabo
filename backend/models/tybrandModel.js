const mongoose = require('mongoose');

const tybrandSchema = new mongoose.Schema({
    brandId: { type: Number, required: true, unique: true },
    name: { type: String, required: true }
});

module.exports = mongoose.model('tyBrand', tybrandSchema);