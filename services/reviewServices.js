const Review = require("../models/reviewModel");
const Factory = require("./handelFactor");

// route category/categoryId/subcategory
// Create
exports.GetAllreviewFormproduct = (req, res, next) => {
  if (!req.body.product) req.body.category = req.params.productId;
  next();
};
// route category/categoryId/subcategory
// Get
exports.CreateFilterObj = (req, res, next) => {
  let filter = {};
  if (req.params.productId) filter = { product: req.params.productId };
  req.filterObject = filter;
  next();
};

// @desc GET review
// @router Get /api/v1/review
// @access Public
exports.getReviews = Factory.getAll(Review);

// @ desc Create review
// @router post /api/v1/review
// @access Privet
exports.CreateReview = Factory.createOne(Review);

// desc Get Specific review by id
// @router Get /api/v1/review/reviewId
// @access Public
exports.GetReview = Factory.getOne(Review);

// desc Update review by id
// @router Put /api/v1/review/reviewId
// @access Public
exports.UpdateReview = Factory.updateOne(Review);
// desc Delete review by id
// @router Put /api/v1/review/reviewId
// @access Public
exports.deleteReview = Factory.deleteOne(Review);
