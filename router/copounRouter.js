const express = require("express");

const {
  CreateCoupon,
  getCoupons,
  GetCoupon,
  UpdateCoupon,
  deleteCoupon,
} = require("../services/couponServes");

const authServices = require("../services/authServices");
const router = express.Router();
// router.use(authServices.protect, authServices.allowedTo("admin"));

router
  .route("/")
  .post(authServices.protect, authServices.allowedTo("admin"), CreateCoupon)
  .get(authServices.protect, authServices.allowedTo("admin"), getCoupons);
router
  .route("/:id")
  .get(authServices.protect, authServices.allowedTo("admin"), GetCoupon)
  .put(authServices.protect, authServices.allowedTo("admin"), UpdateCoupon)
  .delete(authServices.protect, authServices.allowedTo("admin"), deleteCoupon);

module.exports = router;
