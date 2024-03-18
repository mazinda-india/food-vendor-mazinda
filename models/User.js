const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    phoneNumber: { type: String, unique: true, required: true },
    password: { type: String },
    cart: { type: Array, default: [] },
    food_cart: { type: Array, default: [] },
    savedAddresses: { type: Array, default: [] },
    currentAddress: { type: Object, default: {} },
    password_reset_token: { type: String, trim: true },
    allowedPaths: { type: Array, required: false },
    role: { type: String, required: false },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("User", UserSchema);
