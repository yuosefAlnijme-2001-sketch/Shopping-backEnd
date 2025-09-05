const asyncHandler = require("express-async-handler");

const User = require("../models/user");

exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "addresses added successfully",
    data: user.addresses,
  });
});

exports.removeAddres = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        addresses: { _id: req.params.addressId },
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address removed successfully",
    data: user.addresses,
  });
});

exports.updateAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return res.status(404).json({
      status: "fail",
      message: "العنوان غير موجود",
    });
  }

  address.alias = req.body.alias || address.alias;
  address.details = req.body.details || address.details;
  address.phone = req.body.phone || address.phone;
  address.city = req.body.city || address.city;
  address.postCode = req.body.postCode || address.postCode;

  await user.save();

  return res.status(200).json({
    status: "success",
    message: "Address updated successfully",
    data: address,
  });
});

// @desc      Get Specific address from addresses list
// @route     Get /api/v1/addresses/:addressId
// @access    Private/User
exports.getAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const address = user.addresses.id(req.params.addressId);

  return res.status(200).json({
    status: "success",
    data: address,
  });
});

// @desc      Get logged user  addresses
// @route     GET /api/v1/addresses
// @access    Private/User
exports.myAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .select("addresses")
    .populate("addresses");

  res.status(200).json({
    results: user.addresses.length,
    status: "success",
    data: user.addresses,
  });
});
