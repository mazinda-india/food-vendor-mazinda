const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    cart: { type: Array, required: true },
    pricing: { type: Object, required: true },
    address: { type: Object, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: 'Confirmed' },
    isDelivered: { type: Boolean, default: false },
}, { timestamps: true });

mongoose.models = {};
export default mongoose.model("Order", OrderSchema);