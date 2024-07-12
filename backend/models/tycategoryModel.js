const mongoose = require('mongoose');

const tycategorySchema = new mongoose.Schema({
    categoryId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    parentId: { type: Number, default: null }
});

module.exports = mongoose.model('TyCategory', tycategorySchema);