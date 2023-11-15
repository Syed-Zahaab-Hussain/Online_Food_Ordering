const express = require("express");
const path = require("path");
const router = express.Router();
const Vendor = require("../models/vendor");
const MenuItem = require("../models/menu");

router.get("/", (req, res) => {
  const menuPath = path.resolve(__dirname, "../views/admin.html");
  res.sendFile(menuPath);
});

// ------------------------------------------------------------------------------

router.get("/menu", (req, res) => {
  const menuPath = path.resolve(__dirname, "../views/menu.html");
  res.sendFile(menuPath);
});

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

router.post("/vendor/create", async (req, res) => {
  const vendor = new Vendor({
    vendorName: req.body.vendorName,
    description: req.body.description,
  });

  try {
    const newVendor = await vendor.save();
    res.status(201).redirect("/admin");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ------------------------------------------------------------------------------

router.get("/vendor/retrieve", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ------------------------------------------------------------------------------

// Route to insert a new menu item
router.post("/menuitems", async (req, res) => {
  const { itemName, itemDescription, itemPrice, vendorId } = req.body;
  // const vendorId = req.params.vendorId;
  console.log(vendorId);

  try {
    // Check if the referenced vendor exists
    const existingVendor = await Vendor.findById(vendorId);
    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Create a new menu item
    const menuItem = new MenuItem({
      itemName,
      itemDescription,
      itemPrice,
      Vendor: vendorId,
    });

    // Save the menu item to the database
    await menuItem.save();

    // res.status(201).json(menuItem);
    res.status(201).redirect(`/admin/menu?vendorId=${vendorId}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ------------------------------------------------------------------------------

// Route to get menu items for a specific vendor
router.get("/vendor/:vendorId/menuitems", async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const menuItems = await MenuItem.find({ Vendor: vendorId }).populate(
      "Vendor"
    );
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

module.exports = router;

// // Route to get all menu items
// router.get("/menuitems", async (req, res) => {
//   try {
//     const menuItems = await MenuItem.find().populate("Vendor");
//     res.json(menuItems);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Route to get all vendors
// router.get("/vendors", async (req, res) => {
//   try {
//     const vendors = await Vendor.find();
//     res.json(vendors);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
