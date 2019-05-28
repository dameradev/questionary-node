const { body } = require("express-validator/check");
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignUp);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("You need to provide a valid email"),
    body("password", "You need to provide a password with minimum 5 characters")
      .isString()
      .isLength({ min: 5 }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords need to match");
      }
      return true;
    })
  ],
  authController.postSignUp
);

router.get("/reset", authController.getResetPassword);

router.post("/reset", authController.postResetPassword);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
