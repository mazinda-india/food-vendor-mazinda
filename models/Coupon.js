const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  discount: { type: Number, required: true },
  discountType: { type: String, required: true },
  discountOn: { type: String },
  maxLimit: { type: Number },
  minOrder: { type: Number, required: true },
  usageLimit: { type: Number, required: true },
  categories: { type: Array },
  cities: { type: Array },
  description: { type: String },
});

mongoose.models = {};
export default mongoose.model("Coupon", CouponSchema);
