const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: true,
  },
  description: String,
  vendorImage: {
    type: String, // Store the file path in the database
  },
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
