const express = require("express");
const { check, body } = require("express-validator");
const authController = require("../controller/auth");
const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getsignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("please enter valid email")
      .normalizeEmail(),
    body("password", "password length must be more than 6 characters")
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("passwords do not Match");
        }
        return true;
      }),
  ],
  authController.postsignup
);

router.get("/reset", authController.getResetPassword);

router.post("/reset", authController.postResetPassword);

module.exports = router;
