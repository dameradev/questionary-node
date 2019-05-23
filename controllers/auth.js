const bcrypt = require("bcryptjs");

const User = require("../models/user");
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login"
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email });

  if (!user) {
    res.redirect("/login");
  }

  const doMatch = await bcrypt.compare(password, user.password);
  if (doMatch) {
    req.session.user = user;
    req.session.isLoggedIn = true;
    await req.session.save();
    res.redirect("/");
  } else {
    req.redirect("/login");
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Please register",
    path: "/signup"
  });
};

exports.postSignUp = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const hasedPassword = await bcrypt.hash(password, 12);
  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/signup");
  }
  user = new User({
    email,
    password: hasedPassword
  });
  await user.save();
  res.redirect("/login");
};
