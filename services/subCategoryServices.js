const SubCategory = require("../models/subcategoryModel");
const Factory = require("./handelFactor");

// route category/categoryId/subcategory
// Create
exports.GetAllSubCategoryFormCategory = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// route category/categoryId/subcategory
// Get
exports.CreateFilterObj = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) filter = { category: req.params.categoryId };
  req.filterObject = filter;
  next();
};

// @desc GET SubCategory
// @router Get /api/v1/subcategory
// @access Public
exports.getSubCategores = Factory.getAll(SubCategory);

// @ desc Create SubCategory
// @router post /api/v1/subcategory
// @access Privet
exports.CreateSubCategory = Factory.createOne(SubCategory);

// desc Get Specific SubCategory by id
// @router Get /api/v1/subcategorey/subcategoryId
// @access Public
exports.GetSubCategory = Factory.getOne(SubCategory);

// desc Update SubCategory by id
// @router Put /api/v1/subcategorey/subcategoryId
// @access Public
exports.UpdateSubCategory = Factory.updateOne(SubCategory);
// desc Delete subCategory by id
// @router Put /api/v1/subCategorey/subcategoryId
// @access Public
exports.deleteSubCategory = Factory.deleteOne(SubCategory);
