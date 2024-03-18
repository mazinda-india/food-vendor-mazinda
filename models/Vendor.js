const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: Number, required: true, unique: true },
    alternateNumber: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    category: { type: String },
    priority: { type: String },
    imageURI: { type: String },
    whatsapp_group_id: { type: String },
    deliveryLocations: { type: Array, required: true },
    deliveryCharges: { type: Object },
    packingHandlingCharges: { type: String },
    serviceCharges: { type: String },
    deliveryRequirements: { type: Object },
    minOrders: { type: Object },
    openStatus: { type: Boolean, default: true },
    menu: { type: Object, default: {} },
    payPercentage: { type: Number },
    payouts: { type: Object },
    disabled: { type: Boolean, default: false },
    description: {
      type: String,
      maxlength: 15,
    },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("Vendor", VendorSchema);
