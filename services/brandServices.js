const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Brand = require("../models/brandModel");
const Factory = require("./handelFactor");

const { uploadSingleImage } = require("../middlewares/uploadMiddleware");

exports.uploadBrandSingleImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpg")
      .jpeg({ quality: 100 })
      .toFile(`uploads/brand/${filename}`);
    req.body.image = filename;
  }
  next();
});

// @desc GET brand
// @router Get /api/v1/brand
// @access Public
exports.getBrands = Factory.getAll(Brand);

// @ desc Create brand
// @router post /api/v1/brand
// @access Privet
exports.CreateBrand = Factory.createOne(Brand);

// desc Get Specific Brand by id
// @router Get /api/v1/brand/brandId
// @access Public
exports.GetBrand = Factory.getOne(Brand);

// desc Update Brand by id
// @router Put /api/v1/brand/brandId
// @access Public
exports.UpdateBrand = Factory.updateOne(Brand);
// desc Delete Brand by id
// @router Put /api/v1/brand/brandId
// @access Public
exports.deleteBrand = Factory.deleteOne(Brand);
