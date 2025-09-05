const { check } = require("express-validator");

const validMiddleware = require("../../middlewares/validMiddleware");

const User = require("../../models/user");
exports.createValidateWishlist = [
  check("wishlist")
    .optional()
    .custom(async (val, { req }) => {
      const user = await User.findById(val);
      if (user) {
        console.log(user);
      }
      return true;
    }),
  validMiddleware,
];
