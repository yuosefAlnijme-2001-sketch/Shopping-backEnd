const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./productModel");
const reviewScheam = new Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Raview must belong user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Raview must belong Product"],
    },
  },
  { timestamps: true }
);

reviewScheam.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name imgProfile",
  });
  next();
});

// Calculate average product ratings and quantity
reviewScheam.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    }, // Stage 1 "get all reviews in specific product"
    {
      $group: {
        _id: "product",
        avgRating: { $avg: "$rating" },
        nRatings: { $sum: 1 },
      },
    }, // Stage 2
  ]);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRating,
      ratingsQuantity: result[0].nRatings,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0, // set default value
      ratingsQuantity: 0, // set default value
    });
  }
};

reviewScheam.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewScheam.post("remove", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

const reviewModel = mongoose.model("Review", reviewScheam);
module.exports = reviewModel;
