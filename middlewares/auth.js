const User = require("../models/user");
const CustomError = require("../helper/custom-error");

module.exports = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new CustomError("Authorization required", 401);
  }
  req.user = await User.getUserFromToken(authorization);
  if (!req.user) {
    throw new CustomError("User Authorization Failed", 401);
  }
  next();
};
