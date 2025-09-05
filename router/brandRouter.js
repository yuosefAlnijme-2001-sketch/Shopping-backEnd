const express = require("express");

const {
  uploadBrandSingleImage,
  resizeImage,
  CreateBrand,
  GetBrand,
  getBrands,
  UpdateBrand,
  deleteBrand,
} = require("../services/brandServices");
const {
  CreateValidateBrand,
  GetValidateBrand,
  UpdateValidateBrand,
  DeleteValidateBrand,
} = require("../utils/validator/brandValidate");

const authServices = require("../services/authServices");
const router = express.Router();

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    uploadBrandSingleImage,
    resizeImage,
    CreateValidateBrand,
    CreateBrand
  )
  .get(getBrands);
router
  .route("/:id")
  .get(GetValidateBrand, GetBrand)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    uploadBrandSingleImage,
    resizeImage,
    UpdateValidateBrand,
    UpdateBrand
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    DeleteValidateBrand,
    deleteBrand
  );

module.exports = router;
