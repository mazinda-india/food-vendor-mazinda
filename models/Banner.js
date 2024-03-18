const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  banner_type: { type: String, required: true },
  link_type: { type: String, required: true },
  city_ids: { type: Array, required: true },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  product_id: { type: String, required: false },
  external_link: { type: String, required: false },
});

mongoose.models = {};
export default mongoose.model("Banner", BannerSchema);
