const express = require("express");

const CategoryRouter = require("./categoryRouter");
const BrandRouter = require("./brandRouter");
const SubCategoryRouter = require("./subCategoryRouter");
const ProductRouter = require("./productRouter");
const UserRouter = require("./user");
const AuthRouter = require("./authRouter");
const ReviewRouter = require("./reviewRouter");
const WishlistRouter = require("./wishlistRouter");
const AddressRouter = require("./addressRouter");
const CopounRouter = require("./copounRouter");
const CartRouter = require("./cartRouter");
const OrderRouter = require("./orderRouter");

const router = express.Router();

router.use("/category", CategoryRouter);
router.use("/brand", BrandRouter);
router.use("/subcategory", SubCategoryRouter);
router.use("/product", ProductRouter);
router.use("/user", UserRouter);
router.use("/auth", AuthRouter);
router.use("/review", ReviewRouter);
router.use("/wishlist", WishlistRouter);
router.use("/address", AddressRouter);
router.use("/coupon", CopounRouter);
router.use("/cart", CartRouter);
router.use("/order", OrderRouter);

module.exports = router;
