const Coupon = require("../models/couponModel");
const Factory = require("./handelFactor");

// @desc GET coupon
// @router Get /api/v1/coupon
// @access  Privite Admin
exports.getCoupons = Factory.getAll(Coupon);

// @ desc Create coupon
// @router post /api/v1/coupon
// @access Privite Admin
exports.CreateCoupon = Factory.createOne(Coupon);

// desc Get Specific coupon by id
// @router Get /api/v1/coupon/couponId
// @access Privite Admin
exports.GetCoupon = Factory.getOne(Coupon);

// desc Update coupon by id
// @router Put /api/v1/coupon/couponId
// @access Privite Admin
exports.UpdateCoupon = Factory.updateOne(Coupon);
// desc Delete coupon by id
// @router Put /api/v1/coupon/couponId
// @access Privite Admin
exports.deleteCoupon = Factory.deleteOne(Coupon);
