const express = require("express");

const {
  addProductsToCart,
  getLoggedUserCart,
  removeCartProduct,
  clearLoggedUserCart,
  updateCartProductCount,
  applyCouponToCart,
} = require("../services/carrtServices");

const authServices = require("../services/authServices");
const router = express.Router();
router.use(authServices.protect, authServices.allowedTo("user", "admin"));

router.route("/applyCoupon").put(applyCouponToCart);
router
  .route("/")
  .post(addProductsToCart)
  .get(getLoggedUserCart)
  .delete(clearLoggedUserCart);
router.route("/:itemId").delete(removeCartProduct).put(updateCartProductCount);

module.exports = router;
