const slugify = require("slugify");
const { check } = require("express-validator");

const validMiddleware = require("../../middlewares/validMiddleware");

exports.CreateValidateCategory = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name Category is required")
    .isLength({ min: 3 })
    .withMessage("The category name is too short.")
    .isString()
    .withMessage("Name must be a string.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validMiddleware,
];
exports.GetValidateCategory = [
  check("id").isMongoId().withMessage("Invalide Format id"),
  validMiddleware,
];
exports.UpdateValidateCategory = [
  check("id").isMongoId().withMessage("Invalide Format id"),
  validMiddleware,
];
exports.DeleteValidateCategory = [
  check("id").isMongoId().withMessage("Invalide Format id"),
  validMiddleware,
];
