const path = require("path");
const multer = require("multer");

// Importing the MongoDB Models
const Vendor = require("../models/vendor");
const MenuItem = require("../models/menu");
const User = require("../models/user");
const Order = require("../models/order");

// Importing the Script Files
const fetchVendors = require("../public/scripts/vendor_script");
const fetchMenu = require("../public/scripts/menu_script");

// ------------------------------------------------------------------------------

// Define storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Set the destination folder for uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Set unique filenames
  },
});

// Initialize multer with the defined storage
exports.upload = multer({ storage: storage });

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

exports.admin_get = async (req, res) => {
  const adminPath = path.resolve(__dirname, "../views/admin.ejs");

  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });

  try {
    const vendors = await fetchVendors();

    res.render(adminPath, {
      fetchVendors: vendors[0],
      tableHeader: vendors[1],
      isAuth: req.session.isAuth || false,
      user: user || null,
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).send("Internal Server Error");
  }
};

// ------------------------------------------------------------------------------

exports.menu_get = async (req, res) => {
  const parameterValue = req.query.vendorId;

  const menuPath = path.resolve(__dirname, "../views/menu.ejs");
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });

  try {
    const menus = await fetchMenu(parameterValue);

    res.render(menuPath, {
      fetchMenu: menus[0],
      tableHeader: menus[1],
      isAuth: req.session.isAuth || false,
      user: user || null,
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
  const { vendorName, description } = req.body;

  const vendorImage = req.file ? req.file.filename : null; // Get the filename from multer

  const vendor = new Vendor({
    vendorName,
    description,
    vendorImage, // Save the file path in the database
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

exports.vendor_delete = async (req, res) => {
  const { vendorId } = req.body;

  try {
    const deletedVendor = await Vendor.findByIdAndDelete(vendorId);

    if (!deletedVendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res
      .status(200)
      .json({ message: "Vendor deleted successfully", deletedVendor });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------------------------------------------------------------

// Route to insert a new menu item
exports.menu_post = async (req, res) => {
  const { itemName, itemDescription, itemPrice, vendorId } = req.body;
  const itemImage = req.file ? req.file.filename : null; // Get the filename from multer

  try {
    const existingVendor = await Vendor.findById(vendorId);
    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const menuItem = new MenuItem({
      itemName,
      itemDescription,
      itemPrice,
      Vendor: vendorId,
      itemImage, // Save the file path in the database
    });

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

exports.menu_update_isActive = async (req, res) => {
  const { menuId, isActive } = req.body;

  try {
    // Find the MenuItem by ID
    const menuItem = await MenuItem.findOne({ _id: menuId });

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    // Update the isActive field
    menuItem.isActive = isActive;

    // Save the updated MenuItem
    const updatedMenuItem = await menuItem.save();

    res
      .status(200)
      .json({ message: "Menu item updated successfully", updatedMenuItem });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// ------------------------------------------------------------------------------

exports.menu_delete = async (req, res) => {
  const { menuId } = req.body;

  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(menuId);

    if (!deletedMenuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res
      .status(200)
      .json({ message: "Menu item deleted successfully", deletedMenuItem });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------------------------------------------------------------

exports.getAllOrders = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });

  const ordersPath = path.resolve(__dirname, "../views/orders.ejs");

  try {
    const orders = await Order.find()
      .populate("userId")
      .populate({ path: "items.itemId", select: "itemName itemPrice" });

    console.log(orders);

    res.render(ordersPath, {
      orders,
      isAuth: req.session.isAuth || false,
      user: user || null,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

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
