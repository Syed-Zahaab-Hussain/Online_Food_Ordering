const express = require("express");
const path = require("path");
const router = express.Router();
const Customer = require("../models/customer");

router.get("/log-in", (req, res) => {
  const loginPath = path.resolve(__dirname, "../views/log-in.html");
  res.sendFile(loginPath);
});

// ------------------------------------------------------------------------------

router.get("/sign-up", (req, res) => {
  const signupPath = path.resolve(__dirname, "../views/sign-up.html");
  res.sendFile(signupPath);
});

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

router.get("/log-in/get", async (req, res) => {
  const { userName, email, password } = req.query;

  try {
    const customers = await Customer.find({
      email: email,
      password: password,
    });

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ------------------------------------------------------------------------------

router.post("/sign-up/post", async (req, res) => {
  const customer = new Customer({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
    // res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------


module.exports = router;
