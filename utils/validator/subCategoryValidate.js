const slugify = require("slugify");
const { check } = require("express-validator");

const Category = require("../../models/categoryModel");
const validMiddleware = require("../../middlewares/validMiddleware");

exports.CreateValidateSubCategory = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name SubCategory is required")
    .isLength({ min: 3 })
    .withMessage("The SubCategory name is too short.")
    .isString()
    .withMessage("Name must be a string.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalide Format id")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category exist for this id: ${categoryId}`)
          );
        }
      })
    ),
  validMiddleware,
];
exports.GetValidateSubCategory = [
  check("id").isMongoId().withMessage("Invalide Format id"),
  validMiddleware,
];
exports.UpdateValidateSubCategory = [
  check("id").isMongoId().withMessage("Invalide Format id"),
  validMiddleware,
];
exports.DeleteValidateSubCategory = [
  check("id").isMongoId().withMessage("Invalide Format id"),
  validMiddleware,
];
