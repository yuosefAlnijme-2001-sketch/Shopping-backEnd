const express = require("express");

const {
  uploadCategorySingleImage,
  resizeImage,
  CreateCategory,
  GetCategory,
  getCategores,
  UpdateCategory,
  deleteCategory,
} = require("../services/categoryServices");
const {
  CreateValidateCategory,
  GetValidateCategory,
  UpdateValidateCategory,
  DeleteValidateCategory,
} = require("../utils/validator/categoryValidate");
const SubCategory = require("./subCategoryRouter");

const authServices = require("../services/authServices");

const router = express.Router();
router.use("/:categoryId/subcategory", SubCategory);
router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    uploadCategorySingleImage,
    resizeImage,
    CreateValidateCategory,
    CreateCategory
  )
  .get(getCategores);
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    GetValidateCategory,
    GetCategory
  )
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    uploadCategorySingleImage,
    resizeImage,
    UpdateValidateCategory,
    UpdateCategory
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    DeleteValidateCategory,
    deleteCategory
  );
module.exports = router;
