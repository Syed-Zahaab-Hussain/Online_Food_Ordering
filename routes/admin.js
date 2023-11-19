const path = require("path");

// Importing the MongoDB Models
const Vendor = require("../models/vendor");
const MenuItem = require("../models/menu");

// Importing the Script Files
const fetchVendors = require("../public/scripts/vendor_script");
const fetchMenu = require("../public/scripts/menu_script");

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

exports.admin_get = async (req, res) => {
  const adminPath = path.resolve(__dirname, "../views/admin.ejs");

  try {
    const vendors = await fetchVendors();

    res.render(adminPath, {
      fetchVendors: vendors[0],
      tableHeader: vendors[1],
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).send("Internal Server Error");
  }
};

// ------------------------------------------------------------------------------

exports.menu_get = async (req, res) => {
  const parameterValue = req.query.vendorId;
  // console.log(parameterValue);

  const menuPath = path.resolve(__dirname, "../views/menu.ejs");
  try {
    const menus = await fetchMenu(parameterValue);

    res.render(menuPath, {
      fetchMenu: menus[0],
      tableHeader: menus[1],
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).send("Internal Server Error");
  }
};

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

exports.vendor_create = async (req, res) => {
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
};

// ------------------------------------------------------------------------------
// Route to get all vendors
exports.vendor_get = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------------------------------------------------------
// Route to get a single vendors
exports.vendor_get_single = async (req, res) => {
  const vendorId = req.params.vendorId;
  try {
    const vendors = await Vendor.find({ _id: vendorId });
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------------------------------------------------------

// Route to insert a new menu item
exports.menu_post = async (req, res) => {
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
};

// ------------------------------------------------------------------------------

// Route to get menu items for a specific vendor
exports.menu_get_single_vendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const menuItems = await MenuItem.find({ Vendor: vendorId }).populate(
      "Vendor"
    );
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------


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
