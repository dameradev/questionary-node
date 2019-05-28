const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const mailgunTransport = require("nodemailer-mailgun-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  mailgunTransport({
    auth: {
      api_key: "b7387b2b1056a8b5a9dc3c76244f27c3-39bc661a-650350ad",
      domain: "sandboxd68a838d4eee452998c88271207d72d8.mailgun.org"
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

exports.getResetPassword = (req, res, next) => {
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

exports.postResetPassword = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email })
      .then(user => {
        if (!user) {
          req.flash("The user with this email doesn't exist");
          res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect("/");
        transporter.sendMail({
          to: email,
          from: "questionary@support.com",
          subject: "Password reset",
          html: `<h2>You've requested a password reset for ${email}
                 <p> To reset your password please click on this <a href="http://localhost:3000/reset/${token}">link</a></p>
          `
        });
      })
      .catch(err => console.log(err));
  });
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() }
  });
  let message = req.flash("error");
  if (message) {
    message = message[0];
  } else {
    message = null;
  }
  console.log(user);
  res.render("auth/new-password", {
    pageTitle: "Reset password",
    path: "/reset",
    message,
    userId: user._id.toString(),
    passwordToken: token
  });
};

exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect("/login");
    })
    .catch(err => console.log(err));
};

// const newPassword = req.body.newPassword;
// const userId = req.body.userId;
// const passwordToken = req.body.passwordToken;

// const user = await User.find({
//   resetToken: passwordToken,
//   resetTokenExpiration: { $gt: Date.now() },
//   _id: userId
// });
// console.log(user);
// const hashedPassword = await bcrypt.hash(newPassword, 12);

// user.password = hashedPassword;
// user.resetToken = undefined;
// user.resetTokenExpiration = undefined;
// await user.save();

// res.redirect("/login");
