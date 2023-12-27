const path = require("path");
const User = require("../models/user");

// Middleware
exports.isAuth = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    const userInfo = await User.findOne({ _id: userId });

    if (req.session.isAuth && userInfo && userInfo.role === "admin") {
      next();
    } else {
      req.session.error = "You don't have admin rights or you're not logged in";
      res.status(403).redirect("/log-in");
    }
  } catch (error) {
    console.error("Error retrieving user information:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

exports.log_in_get = async (req, res) => {
  const error = req.session.error;
  delete req.session.error;

  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });

  const loginPath = path.resolve(__dirname, "../views/log-in.ejs");
  res.render(loginPath, {
    err: error,
    isAuth: req.session.isAuth || false,
    user: user || null,
  });
};

// ------------------------------------------------------------------------------

exports.sign_up_get = async (req, res) => {
  const error = req.session.error;
  delete req.session.error;

  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });

  const signupPath = path.resolve(__dirname, "../views/sign-up.ejs");
  res.render(signupPath, {
    err: error,
    isAuth: req.session.isAuth || false,
    user: user || null,
  });
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
      req.session.userId = user.id;
      req.session.userName = user.userName;
      req.session.email = user.email;
      if (user.role === "admin") {
        res.status(200).redirect("/admin");
      } else if (user.role === "user") {
        res.status(200).redirect("/");
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
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
};

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
