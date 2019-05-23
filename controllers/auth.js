const User = require("../models/user");
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login"
  });
};

exports.postLogin = async (req, res, next) => {
  const user = await User.findOne();

  req.session.user = user;
  req.session.isLoggedIn = true;
  await req.session.save();
  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
