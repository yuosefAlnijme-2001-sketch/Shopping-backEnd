const multer = require("multer");
const ApiError = require("../utils/ApiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();
  // للسماح بلصور فقط
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images Allowed", 400), false);
    }
  };
  // upload image
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};
// للسماح بصورة واجدة
exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);
// للسماح بعدة صور
exports.uploadOfMixImage = (arrOfFields) => multerOptions().fields(arrOfFields);
