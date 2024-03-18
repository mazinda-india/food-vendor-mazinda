const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true },
    categoryImage: { type: String, required: true },
    subcategories: { type: Array, required: true },
});

mongoose.models = {}
export default mongoose.model("Category", CategorySchema);