const path = require("path");

const Cart = require("../models/cart");
const Order = require("../models/order");
const User = require("../models/user");

const fetchVendors = require("../public/scripts/vendor_script");
const fetchMenu = require("../public/scripts/menu_script");

// ------------------------------------------------------------------------------

exports.user_vendor_get = async (req, res) => {
  const user_vendor_Path = path.resolve(__dirname, "../views/user_vendor.ejs");

  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });

  try {
    const vendors = await fetchVendors();
    
    res.render(user_vendor_Path, {
      fetchVendors: vendors[0],
      isAuth: req.session.isAuth || false,
      user: user || null,
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).send("Internal Server Error");
  }
};

// ------------------------------------------------------------------------------

exports.user_menu_get = async (req, res) => {
  const vendorId = req.params.vendorId;

  const user_menu_Path = path.resolve(__dirname, "../views/user_menu.ejs");

  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });

  try {
    const menus = await fetchMenu(vendorId);

    res.render(user_menu_Path, {
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

exports.user_cart_post = async (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.session.userId;
  // console.log(userId);

  if (!userId) {
    return res.status(401).send("Log-in first");
  }

  try {
    const existingCartItem = await Cart.findOne({ userId, itemId });

    if (existingCartItem) {
      existingCartItem.quantity += parseInt(quantity);
      await existingCartItem.save();
      // console.log(existingCartItem);
    } else {
      const cart = new Cart({
        userId,
        itemId,
        quantity,
      });

      const newCartItem = await cart.save();
      console.log(newCartItem);
    }

    res.status(201).send("Item added to cart successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------------------------------------------------------

exports.getCartItems = async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  // const userId = "6575a8689347892ba7f06752";

  try {
    const cartItems = await Cart.find({ userId }).populate("itemId");

    res.render("cart", {
      cartItems,
      isAuth: req.session.isAuth || false,
      user: user || null,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------------------------------------------------------

exports.deleteCartItem = async (req, res) => {
  const userId = req.session.userId;
  const itemIdToDelete = req.body.itemId;

  try {
    const deletedCartItem = await Cart.findOneAndDelete({
      userId,
      itemId: itemIdToDelete,
    });

    if (!deletedCartItem) {
      return res.status(404).json({ message: "Item not found in the cart." });
    }

    res.redirect("/cart");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------------------------------------------------------

exports.createOrder = async (req, res) => {
  const cartItems = JSON.parse(req.body.cartItems);
  const userId = req.session.userId;

  try {
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.itemId.itemPrice * item.quantity,
      0
    );

    const order = new Order({
      userId,
      items: cartItems.map((item) => ({
        itemId: item.itemId._id,
        quantity: item.quantity,
        totalPrice: item.quantity * item.itemId.itemPrice,
      })),
      totalAmount,
    });

    await order.save();

    await Cart.deleteMany({ userId });

    res.redirect("/cart");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};
