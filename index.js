const express = require("express");
const app = express();
const path = require('path');
const mongoose = require("mongoose");

// ------------------------------------------------------------------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/onlineFoodOrdering");
const db = mongoose.connection;
db.on("error", (error) => {
  console.error(error);
});
db.once("open", () => console.log("connected to database"));

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
