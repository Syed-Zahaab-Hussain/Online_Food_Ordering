require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");

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

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

const authenticationRoute = require("./routes/auth");
app.use("/auth", authenticationRoute);

// ------------------------------------------------------------------------------

const adminRoute = require("./routes/admin");
app.use("/admin", adminRoute);

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

app.listen(3000, () => console.log("server started"));
