const asyncHandler = require("express-async-handler");

const Product = require("../models/productModel");
const Order = require("../models/orderSchema");
const Cart = require("../models/cartModel");

const Factory = require("./handelFactor");
const ApiError = require("../utils/ApiError");

// @desc Create Cash Order
// @router Get /api/v1/orders/cartId
// @access Protected/User

exports.createChashOrder = asyncHandler(async (req, res, next) => {
  // app Setting
  const taxPrice = 0;
  const shippingPrice = 0;
  // محتاج اول اشي اجيب المنتجات يلي بلسله
  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`Not Found this cart with id ${req.params.cartId}`, 404)
    );
  }
  // بدي اجيب السعر المنتجات يلي بلسله واتاكد اذا كان في كوبون ولا لا
  // 2) Get order price depend cart price "check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscound
    ? cart.totalPriceAfterDiscound
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // انشا الاوردر مع طريقه الدفع التلقائيه يلي هيه الكاش
  // 3) Create order with default paymentMethodType cash
  const order = Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  // بعد الانشاء بدي انقص عدد المنتج يلي متوفر عندي وازيد كم حبه انباعت من المنتج
  // 4) After creating , decrement product quantity , increment product sold

  // وصف
  // بدنا نلف على كل المنتجات ونمسك اول منتج من خلال ال فلتر
  // بعدين بدنا انزود على ال عدد المرات يلي انباع فيه المنتج وانقص من عدد المنتجات يلي متوفرة
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    console.log(order);

    // بدي اعمل مسح للمنتج من السله بعد الدفع
    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({
    status: "success",
    data: order,
  });
});

exports.filterOrdersForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObject = { user: req.user._id };
  next();
});

// @desc GET order
// @router Get /api/v1/order
// @access Protect/User-admin
exports.getOrders = Factory.getAll(Order);

// @ desc Create order
// @router post /api/v1/order
// @access Protected/User-Admin
exports.getOrder = Factory.createOne(Order);

// @ desc Update order
// @router put /api/v1/order/:id/pay
// @access Protected/Admin

exports.updateOrderPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no a order with id : ${req.params.id}`, 404)
    );
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updateOrder = await order.save();
  res.status(200).json({ status: "success", data: updateOrder });
});

// @ desc Update orderDelever
// @router put /api/v1/order/:id/deliver
// @access Protected/Admin

exports.updateOrderDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no a order with id : ${req.params.id}`, 404)
    );
  }

  order.isDelivered = true;
  order.DeliveredAt = Date.now();

  const updateOrder = await order.save();
  res.status(200).json({ status: "success", data: updateOrder });
});

// @desc    Create order checkout session
// @route   GET /api/orders/:cartId
// @access  Private/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`Not Found this cart with id ${req.params.cartId}`, 404)
    );
  }
  const cartPrice = cart.totalPriceAfterDiscound
    ? cart.totalPriceAfterDiscound
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        name: req.user.name,
        amount: totalOrderPrice * 100,
        currency: "egp",
        quantity: 1,
      },
    ],
    mode: "payment",
    // success_url: `${req.protocol}://${req.get('host')}/orders`,
    success_url: `http://localhost:3000/user/allorders`,
    // cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    cancel_url: `http://localhost:3000/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // res.redirect(303, session.url);

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});
