const { check, validationResult } = require("express-validator");
const CustomError = require("../helper/custom-error");

const validateLoginRequist = [
  check("email").notEmpty().withMessage("email is required"),
  check("password").notEmpty().withMessage("pasword is required").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError("Invalid request params", 422, errors.mapped());
    }
    next();
  },
];

const validateSignUpRequist = [
  check("fullName").notEmpty().withMessage("Full-name is required").escape(),
  check("email").notEmpty().withMessage("email is required"),
  check("password").notEmpty().withMessage("pasword is required").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError("Invalid request params", 422, errors.mapped());
    }
    next();
  },
];

module.exports = {
  validateLoginRequist,
  validateSignUpRequist,
};
