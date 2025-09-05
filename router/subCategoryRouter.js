const express = require("express");

const {
  CreateSubCategory,
  GetSubCategory,
  getSubCategores,
  UpdateSubCategory,
  deleteSubCategory,
  GetAllSubCategoryFormCategory,
  CreateFilterObj,
} = require("../services/subCategoryServices");
const {
  CreateValidateSubCategory,
  GetValidateSubCategory,
  UpdateValidateSubCategory,
  DeleteValidateSubCategory,
} = require("../utils/validator/subCategoryValidate");

const authServices = require("../services/authServices");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    GetAllSubCategoryFormCategory,
    CreateValidateSubCategory,
    CreateSubCategory
  )
  .get(CreateFilterObj, getSubCategores);
router
  .route("/:id")
  .get(GetValidateSubCategory, GetSubCategory)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    UpdateValidateSubCategory,
    UpdateSubCategory
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    DeleteValidateSubCategory,
    deleteSubCategory
  );
module.exports = router;
