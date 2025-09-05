const asyncHandler = require("express-async-handler");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const ApiError = require("../utils/ApiError");

const calcTotalCartPrice = async (cart) => {
  let totalPrice = 0;

  cart.cartItems.forEach((item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    totalPrice += price * quantity;
  });

  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscound = undefined;
  cart.coupon = undefined;
  await cart.save();
  return totalPrice;
};

// @desc      Add product to cart
// @route     POST /api/v1/cart
// @access    Private/User
exports.addProductsToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  // ✅ اجلب بيانات المنتج من قاعدة البيانات
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // ✅ أنشئ سلة جديدة
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.priceAfterDiscount,
          quantity: 1,
        },
      ],
    });
  } else {
    // ✅ تحقق إذا كان المنتج موجود بنفس اللون
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      // ✅ إذا موجود، زد الكمية
      cart.cartItems[productIndex].quantity += 1;
    } else {
      // ✅ إذا مش موجود، أضفه
      cart.cartItems.push({
        product: productId,
        color,
        price: product.priceAfterDiscount,
        quantity: 1,
      });
    }
  }

  await calcTotalCartPrice(cart);

  res.status(200).json({
    status: "success",
    message: "Products Added to cart successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "cartItems.product",
    select: "title imageCover ratingsAverage brand category priceAfterDiscount",
    populate: [
      { path: "brand", select: "name -_id", model: "Brand" },
      { path: "category", select: "name -_id", model: "Category" },
    ],
  });
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user is : ${req.user._id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    numberOfCartItem: cart.cartItems.length,
    data: cart,
  });
});

// @desc      Remove product from cart
// @route     DELETE /api/v1/cart/:itemId
// @access    Private/User
exports.removeCartProduct = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: itemId } },
    },
    { new: true }
  );
  await calcTotalCartPrice(cart);

  return res.status(200).json({
    status: "success",
    numOfCartItems: cart.products.length,
    data: cart,
  });
});

// @desc      Clear logged user cart
// @route     DELETE /api/v1/cart
// @access    Private/User
exports.clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });

  res
    .status(204)
    .json({ status: "success", message: "Delete All product fro cart" });
});

// @desc      Update product quantity
// @route     Put /api/v1/cart/:itemId
// @access    Private/User
exports.updateCartProductCount = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  // 1) Check if there is cart for logged user
  const cart = await Cart.findOne({ user: req.user._id })
    .populate({
      path: "cartItems.product",
      select: "title imageCover ratingsAverage brand category ",
      populate: { path: "brand", select: "name -_id", model: "Brand" },
    })
    .populate({
      path: "cartItems.product",
      select: "title imageCover ratingsAverage brand category",
      populate: { path: "category", select: "name -_id", model: "Category" },
    });
  console.log(cart);

  if (!cart) {
    return next(
      new ApiError(`No cart exist for this user: ${req.user._id}`, 404)
    );
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex > -1) {
    const productItem = cart.cartItems[itemIndex];
    productItem.quantity = quantity;
    cart.cartItems[itemIndex] = productItem;
  } else {
    return next(
      new ApiError(`No Product Cart item found for this id: ${itemId}`)
    );
  }
  // Calculate total cart price
  await calcTotalCartPrice(cart);

  return res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc      Apply coupon logged user cart
// @route     PUT /api/v1/cart/applyCoupon
// @access    Private/User
exports.applyCouponToCart = asyncHandler(async (req, res, next) => {
  const { couponName } = req.body;
  // 2) Get current user cart
  const cart = await Cart.findOne({ user: req.user._id });

  // 1) Get coupon based on it's unique name and expire > date.now
  const coupon = await Coupon.findOne({
    name: couponName,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    cart.totalPriceAfterDiscound = undefined;
    cart.coupon = undefined;
    await cart.save();
    return next(new ApiError("Coupon is invalid or has expired", 400));
  }

  const totalPrice = await calcTotalCartPrice(cart);

  const totalAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.99

  cart.totalPriceAfterDiscound = totalAfterDiscount;
  cart.coupon = coupon.name;

  await cart.save();

  return res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    coupon: coupon.name,
    data: cart,
  });
});
