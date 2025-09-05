const { check } = require("express-validator");
const slugify = require("slugify");
const bcript = require("bcryptjs");
const validMiddleware = require("../../middlewares/validMiddleware");
const User = require("../../models/user");

exports.CreateValidUser = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Please Inter UserName...")
    .isLength({ min: 2 })
    .withMessage("")
    .isString()
    .withMessage("")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  // .custom((val) => {
  //   const user = User.findOne({ name: val });
  //   if (!user) {
  //     return Promise.reject(new Error("Name is Alreay register"));
  //   }
  // }),

  check("email")
    .trim()
    .notEmpty()
    .withMessage("Please Inter Email")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        return Promise.reject(new Error("E_mail already in user"));
      }
    }),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Please Inter Password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 charecter")
    .custom((val, { req }) => {
      if (req.body.passwordConfirm !== val) {
        throw new Error("password or passwordConfirm not correct");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Please Inter Password Confirm"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-PS"])
    .withMessage("Please Inter Phone Palestine"),
  check("imgProfile").optional(),
  check("role").optional(),
  validMiddleware,
];

exports.GetValidUser = [
  check("id").isMongoId().withMessage("Invalid Id format"),
  validMiddleware,
];
exports.UpdateValidUser = [
  check("id").isMongoId().withMessage("Invalid Id format"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validMiddleware,
];

exports.DeleteValidUser = [
  check("id").isMongoId().withMessage("Invalid Id format"),
  validMiddleware,
];

exports.changeValidateUserPassword = [
  check("id").isMongoId().withMessage("Invalid format id"),
  check("currentPassword").notEmpty().withMessage("Please Inter Old Password"),
  check("passwordConfirm").notEmpty().withMessage("Please Inter New Password"),
  check("password")
    .notEmpty()
    .withMessage("Please Inter confirm New Password")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      const isCurrentPassword = await bcript.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCurrentPassword) {
        throw new Error("Please enter a correct password.");
      }

      if (req.body.passwordConfirm !== val) {
        throw new Error("new_Password or confirmNewPassword is not correct");
      }
      return true;
    }),
  validMiddleware,
];
