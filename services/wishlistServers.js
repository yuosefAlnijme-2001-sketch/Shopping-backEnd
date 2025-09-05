const asyncHandler = require("express-async-handler");

const User = require("../models/user");
const ApiError = require("../utils/ApiError");

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Product added successfully to your wishlist",
    data: user.wishlist,
  });
});

exports.removeProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Product remove successfully to your wishlist",
    data: user.wishlist,
  });
});

exports.GetLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  if (!user) {
    return next(
      new ApiError(`Not Found any wishlist for this user ${user.name}`)
    );
  }

  res.status(200).json({ status: "success", data: user.wishlist });
});
