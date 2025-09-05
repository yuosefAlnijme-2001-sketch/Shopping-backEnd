const slugify = require("slugify");
const { check } = require("express-validator");

const validMiddleware = require("../../middlewares/validMiddleware");

exports.CreateValidateBrand = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name Brand is required")
    .isLength({ min: 3 })
    .withMessage("The brand name is too short.")
    .isString()
    .withMessage("Name must be a string.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validMiddleware,
];
exports.GetValidateBrand = [
  check("id").isMongoId().withMessage("Invalide Format id"),
  validMiddleware,
];
exports.UpdateValidateBrand = [
  check("id").isMongoId().withMessage("Invalide Format id"),
  validMiddleware,
];
exports.DeleteValidateBrand = [
  check("id").isMongoId().withMessage("Invalide Format id"),
  validMiddleware,
];
