const express = require("express");

const {
  uploadProductImages,
  resizeProductImages,
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} = require("../services/productServices");
const {
  CreateValidateProduct,
  GetValidateProduct,
  UpdateValidateProduct,
  DeleteValidateProduct,
} = require("../utils/validator/productValidate");

const authServices = require("../services/authServices");
const ReviewsRouter = require("./reviewRouter");
const router = express.Router();

router.use("/:productId/reviews", ReviewsRouter);

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    uploadProductImages,
    resizeProductImages,
    CreateValidateProduct,
    createProduct
  )
  .get(getProducts);
router
  .route("/:id")
  .get(GetValidateProduct, getProduct)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    UpdateValidateProduct,
    updateProduct
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    DeleteValidateProduct,
    deleteProduct
  );

router.route("/:id/productlike").get(getRelatedProducts);
module.exports = router;
