const express = require("express");

const {
  register,
  login,
  forgotPassword,
  forgotPasswordWhatsApp,
} = require("../services/authServices");
const {
  registerValidate,
  loginValiadeUser,
} = require("../utils/validator/authValidate");

const router = express.Router();

router.post("/register", registerValidate, register);
router.post("/login", loginValiadeUser, login);
router.post("/forgetpassword", forgotPassword);
router.post("/forgotPasswordWhatsApp", forgotPasswordWhatsApp);
module.exports = router;
