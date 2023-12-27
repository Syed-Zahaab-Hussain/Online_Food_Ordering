const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemDescription: String,
  itemPrice: {
    type: Number,
    required: true,
  },
  Vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  itemImage: {
    type: String, // Store the file path in the database
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;
