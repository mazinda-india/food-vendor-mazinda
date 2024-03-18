const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    city: { type: String, required: true },
    pincodes: { type: Array, required: true },
    available: { type: Boolean, required: false },
});

mongoose.models = {}
export default mongoose.model("Location", LocationSchema);