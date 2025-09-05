const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Category = require("../models/categoryModel");
const Factory = require("./handelFactor");

const { uploadSingleImage } = require("../middlewares/uploadMiddleware");

exports.uploadCategorySingleImage = uploadSingleImage("image");
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpg")
      .jpeg({ quality: 100 })
      .toFile(`uploads/category/${filename}`);
    req.body.image = filename;
  }
  next();
});

// @desc GET Category
// @router Get /api/v1/category
// @access Public
exports.getCategores = Factory.getAll(Category);

// @ desc Create Category
// @router post /api/v1/category
// @access Privet
exports.CreateCategory = Factory.createOne(Category);

// desc Get Specific Category by id
// @router Get /api/v1/categorey/categoryId
// @access Public
exports.GetCategory = Factory.getOne(Category);

// desc Update Category by id
// @router Put /api/v1/categorey/categoryId
// @access Public
exports.UpdateCategory = Factory.updateOne(Category);
// desc Delete Category by id
// @router Put /api/v1/categorey/categoryId
// @access Public
exports.deleteCategory = Factory.deleteOne(Category);
