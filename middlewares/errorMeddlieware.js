const ApiError = require("../utils/ApiError");

const GlobelError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "developments") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handelJWT();
    sendErrorForProd(err, res);
  }
};
const handelJWT = () => {
  new ApiError("Invalid token , please login again", 401);
};
const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
module.exports = GlobelError;
