const express = require("express");

const {
  CreateReview,
  getReviews,
  GetReview,
  UpdateReview,
  deleteReview,
  GetAllreviewFormproduct,
  CreateFilterObj,
} = require("../services/reviewServices");
const {
  CreateValidateReview,
  GetValidateReview,
  UpdateValidateReview,
  DeleteValidateReview,
} = require("../utils/validator/reviewValidate");

const authServices = require("../services/authServices");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("user"),
    GetAllreviewFormproduct,
    CreateValidateReview,
    CreateReview
  )
  .get(CreateFilterObj, getReviews);
router
  .route("/:id")
  .get(GetValidateReview, GetReview)
  .put(
    authServices.protect,
    authServices.allowedTo("user"),
    UpdateValidateReview,
    UpdateReview
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("user", "admin"),
    DeleteValidateReview,
    deleteReview
  );

module.exports = router;
