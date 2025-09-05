const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const multer = require("multer");

const ApiError = require("../utils/ApiError");
const Product = require("../models/productModel");
const factory = require("./handelFactor");

// Storage
const multerStorage = multer.memoryStorage();

// Accept only images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("only images allowed", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProductImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const ext = req.files.imageCover[0].mimetype.split("/")[1];
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.${ext}`;
    await sharp(req.files.imageCover[0].buffer).toFile(
      `uploads/product/${imageCoverFilename}`
    );
    req.body.imageCover = imageCoverFilename;
  }
  req.body.images = [];
  if (req.files.images) {
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const ext = img.mimetype.split("/")[1];
        const filename = `product-${uuidv4()}-${Date.now()}-${
          index + 1
        }.${ext}`;
        await sharp(img.buffer).toFile(`uploads/product/${filename}`);
        req.body.images.push(filename);
      })
    );
  }
  next();
});

// @desc      Get all products
// @route     GET /api/v1/products
// @access    Public
exports.getProducts = factory.getAll(Product, "Products");

// @desc      Get specific product by id
// @route     GET /api/v1/products/:id
// @access    Public
exports.getProduct = factory.getOne(Product, "reviews");

// @desc      Create product
// @route     POST /api/v1/products
// @access    Private
exports.createProduct = factory.createOne(Product);
// @desc      Update product
// @route     PATCH /api/v1/products/:id
// @access    Private
exports.updateProduct = factory.updateOne(Product);

// @desc     Delete product
// @route    DELETE /api/v1/products/:id
// @access   Private
exports.deleteProduct = factory.deleteOne(Product);

// controllers/productController.js
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    }).limit(8);

    res.status(200).json({ data: relatedProducts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
