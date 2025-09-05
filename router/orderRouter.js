const express = require("express");
const {
  createChashOrder,
  getOrder,
  getOrders,
  updateOrderDelivered,
  updateOrderPaid,
  filterOrdersForLoggedUser,
} = require("../services/orderServies");
const authServices = require("../services/authServices");
const router = express.Router();

router.use(authServices.protect);

router.route("/:cartId").post(authServices.allowedTo("user"), createChashOrder);
router
  .route("/")
  .get(
    authServices.allowedTo("user", "admin"),
    filterOrdersForLoggedUser,
    getOrders
  );
router.get("/:id", getOrder);
router.put("/:id/pay", authServices.allowedTo("admin"), updateOrderPaid);
router.put(
  "/:id/deliver",
  authServices.allowedTo("admin"),
  updateOrderDelivered
);
module.exports = router;
