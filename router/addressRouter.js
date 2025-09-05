const express = require("express");

const {
  addAddress,
  removeAddres,
  myAddresses,
  updateAddress,
  getAddress,
} = require("../services/addressServes");

const authServices = require("../services/authServices");
const router = express.Router();
router.use(authServices.protect, authServices.allowedTo("user", "admin"));
router.route("/").post(addAddress).get(myAddresses);

router
  .route("/:addressId")
  .get(getAddress)
  .put(updateAddress)
  .delete(removeAddres);

module.exports = router;
