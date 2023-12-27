require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const User = require("./models/user");

const authRoute = require("./controller/auth");
const adminRoute = require("./controller/admin");
const userRoute = require("./controller/user");

// ------------------------------------------------------------------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.LOCAL_DATABASE_URL);
// mongoose.connect(process.env.ATLAS_DATABASE_URL);

const db = mongoose.connection;
db.on("error", (error) => {
  console.error(error);
});
db.once("open", () => console.log("connected to database"));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));
app.use("/uploads", express.static("public/uploads"));

// Session
const store = new MongoDBStore({
  uri: process.env.LOCAL_DATABASE_URL,
  collection: "mySessions",
});

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

// ------------------------------------------------------------------------------
app.get("/", async (req, res) => {
  const userId = req.session.userId;
  const rootPath = path.resolve(__dirname, "views/index.ejs");

  const user = await User.findOne({ _id: userId });

  res.render(rootPath, {
    isAuth: req.session.isAuth || false,
    user: user || null,
  });
});

// Auth
app.post("/admin/logout", authRoute.logout_post);
app.get("/log-in", authRoute.log_in_get);
app.post("/log-in/verify", authRoute.log_in_verify);
app.get("/sign-up", authRoute.sign_up_get);
app.post("/sign-up/post", authRoute.sign_up_create);

// ------------------------------------------------------------------------------
app.get("/admin", authRoute.isAuth, adminRoute.admin_get);
app.post(
  "/admin/vendor/create",
  adminRoute.upload.single("itemImage"),
  adminRoute.vendor_create
);
app.get("/admin/vendor/get", adminRoute.vendor_get);
app.get("/admin/vendor/:vendorId", adminRoute.vendor_get_single);
app.get("/admin/menu", adminRoute.menu_get);
app.post(
  "/admin/menu/post",
  adminRoute.upload.single("itemImage"),
  adminRoute.menu_post
);
app.get("/admin/vendor/:vendorId/menuitems", adminRoute.menu_get_single_vendor);
app.delete("/admin/vendor/delete", adminRoute.vendor_delete);
app.put("/admin/menu/update", adminRoute.menu_update_isActive);
app.delete("/admin/menu/delete", adminRoute.menu_delete);
app.get("/admin/orders", adminRoute.getAllOrders);

// ------------------------------------------------------------------------------
app.get("/vendor", userRoute.user_vendor_get);
app.get("/menu/:vendorId", userRoute.user_menu_get);
app.post("/menu/cart/add", userRoute.user_cart_post);
app.get("/cart", userRoute.getCartItems);
app.post("/order/create", userRoute.createOrder);
app.post("/cart/delete", userRoute.deleteCartItem);

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

app.listen(3000, () => console.log("server started"));
