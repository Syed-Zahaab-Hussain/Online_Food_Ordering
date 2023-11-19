const path = require("path");
const User = require("../models/user");

// Middleware
exports.isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    req.session.error = "You have to Login first";
    res.status(403).redirect("/log-in");
  }
};

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

exports.log_in_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;

  const loginPath = path.resolve(__dirname, "../views/log-in.ejs");
  res.render(loginPath, { err: error });
};

// ------------------------------------------------------------------------------

exports.sign_up_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;

  const signupPath = path.resolve(__dirname, "../views/sign-up.ejs");
  res.render(signupPath, { err: error });
};

// ------------------------------------------------------------------------------

exports.log_in_verify = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      email: email,
      password: password,
    });

    if (user) {
      req.session.isAuth = true;
      req.session.userName = user.userName;
      if (user.role === "admin") {
        res.status(200).redirect("/admin");
      } else if (user.role === "user") {
        res.status(200).json("confirmed");
      }
    } else {
      req.session.error = "Invalid Credentials";
      res.status(404).redirect("/log-in");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------------------------------------------------------

exports.sign_up_create = async (req, res) => {
  const { userName, email, password, role } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    req.session.error = "User already exists";
    return res.redirect("/sign-up");
  }

  const newUser = new User({
    userName,
    email,
    password,
    role,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).redirect("/log-in");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ------------------------------------------------------------------------------

exports.logout_post = (req, res) => {
  console.log(req.session);

  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/log-in");
  });
};

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
