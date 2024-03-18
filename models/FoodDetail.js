const mongoose = require("mongoose");
const FoodDetailsSchema = new mongoose.Schema({
  cutleryDetail: {
    isAvailable: {
      type: Boolean,

      default: false,
    },
    price: {
      type: Number,

      default: 0,
    },
  },
  mode: {
    mode: {
      type: String,

      enum: ["automatic", "manual"],
      default: "automatic",
    },
  },
  alert: {
    message: {
      type: String,
    },
    isActive: {
      type: Boolean,
    },
  },
});
mongoose.models = {};

export default mongoose.model("FoodDetail", FoodDetailsSchema);
