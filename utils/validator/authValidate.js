const { check } = require("express-validator");
const slugify = require("slugify");
const User = require("../../models/user");
const validMiddleware = require("../../middlewares/validMiddleware");

exports.registerValidate = [
  check("name")
    .notEmpty()
    .withMessage("Please enter your username")
    .isLength({ min: 3 })
    .withMessage("Please enter at least 3 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Please enter your email address.")
    .isEmail()
    .withMessage("Enter a valid email address")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("E_mail is already in user");
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isLength({ min: 6 })
    .withMessage("Enter at least 6 letters"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Please enter your confirm Password")
    .custom((val, { req }) => {
      if (req.body.password !== val) {
        throw new Error("Password or confirm Password Not true");
      }
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-PS"])
    .withMessage("Please Inter Phone Palestine"),
  validMiddleware,
];

exports.loginValiadeUser = [
  check("email")
    .notEmpty()
    .withMessage("Please enter your email address.")
    .isEmail()
    .withMessage("Enter a valid email address"),

  check("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isLength({ min: 6 })
    .withMessage("Enter at least 6 letters"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Please enter your confirm Password")
    .custom((val, { req }) => {
      if (req.body.password !== val) {
        throw new Error("Password or confirm Password Not true");
      }
      return true;
    }),
];
