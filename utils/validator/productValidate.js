const { check, body } = require("express-validator");
const slugify = require("slugify");

const validMiddleware = require("../../middlewares/validMiddleware");

const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subcategoryModel");
const Brand = require("../../models/brandModel");
const Product = require("../../models/productModel");

exports.CreateValidateProduct = [
  check("title")
    .notEmpty()
    .withMessage("Product required")
    .isLength({ min: 3, max: 32 })
    .withMessage("At least three letters and at most 32")
    // .custom((val, { req }) => {
    //   req.body.slug = slugify(val);
    //   return true;
    // })
    .custom(async (value) => {
      const product = await Product.findOne({ title: value });
      if (product) {
        throw new Error("Product title already exists");
      }
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 2 })
    .withMessage("The description is too short")
    .isLength({ max: 52 })
    .withMessage("The description is too long"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),

  check("priceBefor")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),

  check("priceAfterDiscount")
    .optional()
    .isFloat()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .custom((val, { req }) => {
      if (val >= req.body.priceBefor) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("availableColors").optional().toArray(),
  check("images")
    .optional()
    .isArray()
    .toArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        return Promise.reject(
          new Error(`Not found this category for this id ${categoryId}`)
        );
      }
    }),
  check("subcategory")
    .optional()
    .toArray()
    .custom((subcategoriesIds) =>
      SubCategory.find({
        _id: { $exists: true, $in: subcategoriesIds },
      }).then((results) => {
        if (results.length < 1 || subcategoriesIds.length !== results.length) {
          console.log(results);
          return Promise.reject(new Error("Invalid subcategories Ids"));
        }
      })
    )
    .custom((val, { req }) =>
      SubCategory.find({
        category: req.body.category,
      }).then((subcategories) => {
        const subIdsInDB = [];
        subcategories.forEach((subcategory) => {
          subIdsInDB.push(subcategory._id.toString());
        });
        const checker = (arr, target) => target.every((t) => arr.includes(t));
        if (!checker(subIdsInDB, val)) {
          return Promise.reject(
            new Error("Subcategory not belong to category")
          );
        }
      })
    ),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Not found Brand for this id")
    .custom(async (brandId) => {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        return Promise.reject(
          new Error(`Not found Brand for this Id ${brandId}`)
        );
      }
    }),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isFloat({ min: 1.0, max: 5.0 })
    .withMessage("ratingsAverage must be between 1.0 and 5.0"),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validMiddleware,
];

exports.GetValidateProduct = [
  check("id").isMongoId().withMessage("Invalid Product Id"),
  validMiddleware,
];

exports.UpdateValidateProduct = [
  check("id").isMongoId().withMessage("Invalid product Id"),
  // body("title").custom((val, { req }) => {
  //   req.body.slug = slugify(val);
  //   return true;
  // }),
  validMiddleware,
];

exports.DeleteValidateProduct = [
  check("id").isMongoId().withMessage("Invalid Product Id"),
  validMiddleware,
];
