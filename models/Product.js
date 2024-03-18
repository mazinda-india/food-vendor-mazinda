const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    storeId: { type: String, required: true },
    pricing: { type: Object },
    category: { type: String },
    subcategory: { type: String },
    imagePaths: { type: Array },
    tags: { type: Array },
    variants: { type: Object },
    variantsInfo: { type: Object },
    combinationName: { type: String },
    variantId: { type: String },
    topDeal: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    description: { type: Array },
    isAvailable: { type: Boolean, default: true },
    approvalStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("Product", ProductSchema);
