require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const authRoute = require("./routes/auth");
const adminRoute = require("./routes/admin");

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
app.post("/admin/logout", authRoute.logout_post);

app.get("/log-in", authRoute.log_in_get);
app.post("/log-in/verify", authRoute.log_in_verify);

app.get("/sign-up", authRoute.sign_up_get);
app.post("/sign-up/post", authRoute.sign_up_create);

// ------------------------------------------------------------------------------
app.get("/admin", authRoute.isAuth, adminRoute.admin_get);
app.post("/admin/vendor/create", adminRoute.vendor_create);
app.get("/admin/vendor/get", adminRoute.vendor_get);
app.get("/admin/vendor/:vendorId", adminRoute.vendor_get_single);

app.get("/admin/menu", adminRoute.menu_get);
app.post("/admin/menu/post", adminRoute.menu_post);
app.get("/admin/vendor/:vendorId/menuitems", adminRoute.menu_get_single_vendor);

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

app.listen(3000, () => console.log("server started"));
