const mongoose = require("mongoose");

const BulkUploadRequestSchema = new mongoose.Schema(
  {
    storeId: { type: String, required: true },
    storeName: { type: String },
    filePath: { type: String, required: true },
    approved: { type: String, default: false },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("BulkUploadRequest", BulkUploadRequestSchema);
