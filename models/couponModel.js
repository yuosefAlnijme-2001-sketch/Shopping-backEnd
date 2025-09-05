const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name Coupon required"],
      trim: true,
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "Expire Coupon required"],
    },
    discount: {
      type: Number,
      required: [true, "coupon discount required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", CouponSchema);
