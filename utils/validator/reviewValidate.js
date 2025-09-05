const { check } = require("express-validator");
const Review = require("../../models/reviewModel");
const validMiddleware = require("../../middlewares/validMiddleware");

exports.CreateValidateReview = [
  check("name").optional(),
  check("rating")
    .notEmpty()
    .withMessage("Rating value required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating is value must be between 1 to 5"),
  check("user").isMongoId().withMessage("Invalide Format id User"),
  check("product")
    .isMongoId()
    .withMessage("Invalide Format id Products")
    .custom(async (val, { req }) => {
      const user = await Review.findOne({
        user: req.user._id.toString(),
        product: req.body.product,
      });
      if (user) {
        return Promise.reject(new Error("You already created a review befor"));
      }
    }),
  validMiddleware,
];
exports.GetValidateReview = [
  check("id").isMongoId().withMessage("Invalide Format id Review"),
  validMiddleware,
];
exports.UpdateValidateReview = [
  check("id")
    .isMongoId()
    .withMessage("Invalide Format id Review")
    .custom((val, { req }) => {
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));
        }
        console.log(review.user._id.toString());
        console.log(req.user._id.toString());

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`Your are not allowed to perform this action`)
          );
        }
      });
    }),
  validMiddleware,
];
// exports.DeleteValidateReview = [
//   check("id")
//     .isMongoId()
//     .withMessage("Invalide Format id Review")
//     .custom(async (val, { req }) => {
//       if (req.user.role === "user") {
//         await Review.findById(val).then((review) => {
//           if (review.user._id.toString() !== req.user._id.toString()) {
//             return Promise.reject(
//               new Error(`Your are not allowed to perform this action`)
//             );
//           }
//         });
//       }
//     }),
//   validMiddleware,
// ];

exports.DeleteValidateReview = [
  check("id")
    .isMongoId()
    .withMessage("Invalide Format id Review")
    .custom(async (val, { req }) => {
      if (req.user.role === "user") {
        const review = await Review.findById(val);

        if (!review) {
          throw new Error("التقييم غير موجود");
        }

        if (review.user.toString() !== req.user._id.toString()) {
          throw new Error("غير مسموح لك بحذف تقييم ليس ملكك");
        }
      }

      return true; // لازم ترجع true لو كل شيء تمام ✅
    }),
  validMiddleware,
];
