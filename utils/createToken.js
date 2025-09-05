const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  jwt.sign({ userId: payload }, process.env.JWT_KEY_SECRIPT, {
    expiresIn: process.env.EXPIRES,
  });
};
module.exports = createToken;
