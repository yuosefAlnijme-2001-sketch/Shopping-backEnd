const express = require("express");

const {
  addProductToWishlist,
  removeProductToWishlist,
  GetLoggedUserWishlist,
} = require("../services/wishlistServers");
const {
  createValidateWishlist,
} = require("../utils/validator/wishlistValidate");

const authServices = require("../services/authServices");
const router = express.Router();
router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("user"),
    createValidateWishlist,
    addProductToWishlist
  )
  .get(authServices.protect, GetLoggedUserWishlist);

router.delete(
  "/:productId",
  authServices.protect,
  authServices.allowedTo("user"),
  removeProductToWishlist
);
module.exports = router;
