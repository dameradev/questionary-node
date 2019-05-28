const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    message
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email });

  if (!user) {
    req.flash("error", "Invalid email or password");
    res.redirect("/login");
  }

  const doMatch = await bcrypt.compare(password, user.password);
  if (doMatch) {
    req.session.user = user;
    req.session.isLoggedIn = true;
    await req.session.save();
    res.redirect("/");
  } else {
    req.flash("error", "Invalid email or password");
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
  let message = req.flash("error");
  if (message) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    pageTitle: "Please register",
    path: "/signup",
    message
  });
};

exports.postSignUp = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 12);
  let user = await User.findOne({ email });
  if (user) {
    req.flash("error", "User with this email already exists");
    return res.redirect("/signup");
  }
  user = new User({
    email,
    password: hashedPassword
  });
  await user.save();

  transporter.sendMail({
    to: email,
    from: "questionary@support.com",
    subject: "You've succesfully registered",
    html: "<h1>Thanks for registering on Questionary</h1>"
  });
  res.redirect("/login");
};

const getResetPassword = (req, res, next) => {
  let message = req.flash("error");
  if (message) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    pageTitle: "Reset password",
    path: "/reset",
    message
  });
};
