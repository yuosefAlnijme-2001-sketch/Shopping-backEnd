const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcript = require("bcryptjs");

const User = require("../models/user");
const Factory = require("./handelFactor");

const { uploadSingleImage } = require("../middlewares/uploadMiddleware");
const ApiError = require("../utils/ApiError");

exports.uploadUserSingleImage = uploadSingleImage("imgProfile");
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpg")
      .jpeg({ quality: 100 })
      .toFile(`uploads/user/${filename}`);
    req.body.imgProfile = filename;
  }
  next();
});

// @desc GET User
// @router Get /api/v1/user
// @access Privte
exports.getUsers = Factory.getAll(User);

// @ desc Create User
// @router post /api/v1/user
// @access Privte
exports.CreateUser = Factory.createOne(User);

// desc Get Specific User by id
// @router Get /api/v1/user/userId
// @access Privte
exports.Getuser = Factory.getOne(User);

// desc Delete User by id
// @router Put /api/v1/user/userId
// @access Privte
exports.deleteUser = Factory.deleteOne(User);

// desc Update User by id
// @router Put /api/v1/user/userId
// @access Privte

exports.UpdateUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      imgProfile: req.body.imgProfile,
      role: req.body.role,
    },
    { new: true }
  );
  if (!user) {
    return next(
      new ApiError(`No document found for this id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: user });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcript.hash(req.body.password, 12),
    },
    { new: true }
  );
  if (!user) {
    return next(ApiError(`No documents for this id user ${req.params.id}`));
  }
  res.status(200).json({ data: user });
});

// @desc    Get Logged user data
// @route   GET /api/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
