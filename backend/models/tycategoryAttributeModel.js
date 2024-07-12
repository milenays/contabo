const mongoose = require('mongoose');

const tycategoryAttributeSchema = new mongoose.Schema({
    categoryId: { type: Number, required: true },
    attributeId: { type: Number, required: true },
    name: { type: String, required: true },
    required: { type: Boolean, default: false },
    allowCustom: { type: Boolean, default: false },
    varianter: { type: Boolean, default: false },
    slicer: { type: Boolean, default: false },
    attributeValues: [{
        id: Number,
        name: String
    }]
});

tycategoryAttributeSchema.index({ categoryId: 1, attributeId: 1 }, { unique: true });

module.exports = mongoose.model('tyCategoryAttribute', tycategoryAttributeSchema);