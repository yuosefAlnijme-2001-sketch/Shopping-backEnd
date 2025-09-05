const express = require("express");

const {
  uploadUserSingleImage,
  resizeImage,
  CreateUser,
  Getuser,
  getUsers,
  UpdateUserData,
  deleteUser,
  changePassword,
  getLoggedUserData,
} = require("../services/userServices");

const {
  CreateValidUser,
  changeValidateUserPassword,
} = require("../utils/validator/userValidate");

const authServices = require("../services/authServices");

const router = express.Router();

router.get("/getMy", authServices.protect, getLoggedUserData, Getuser);

router.use(
  authServices.protect,
  authServices.allowedTo("admin", "manger", "user")
);

router
  .route("/")
  .post(uploadUserSingleImage, resizeImage, CreateValidUser, CreateUser)
  .get(getUsers);

router
  .route("/:id")
  .get(Getuser)
  .put(uploadUserSingleImage, resizeImage, UpdateUserData)
  .delete(deleteUser);
// Change Password
router.put("/changePassword/:id", changeValidateUserPassword, changePassword);
module.exports = router;
