const express = require("express");
require("express-async-errors");
const User = require("../models/user");
const CustomError = require("../helper/custom-error");
const {
  validateLoginRequist,
  validateSignUpRequist,
} = require("../middlewares/validate-request");
const authenticate = require("../middlewares/auth");

const router = express.Router();

router.get("/:token", async (req, res, next) => {
  const token = req.params.token;
  const user = await User.getUserFromToken(token);
  if (user) {
    return res.json({ user });
  }
  res.status(401).json({ message: "Invalid Token" });
});

router.post("/login", validateLoginRequist, async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findByCredentials({ email, password });

  if (!user) throw new CustomError("Invalid Credentials", 422);
  const token = await user.generateToken();

  res.json({
    user,
    token,
    message: "Logged in successfully",
  });
});

router.post("/", validateSignUpRequist, async (req, res, next) => {
  const user = new User(req.body);
  const [token] = await Promise.all([user.generateToken(), user.save()]);
  res.status(201).json({
    user,
    token,
    message: "Signed up successfully",
  });
});

router.post("/subscribe/:source_id", authenticate, async (req, res, next) => {
  const source_id = req.params.source_id;
  const isSubscribed = req.user.sources.includes(source_id);
  const message = `${
    isSubscribed ? "Unsubscribed" : "Subscribed"
  } successfully`;
  const operator = isSubscribed ? "$pull" : "$push";
  await req.user.updateOne({
    [operator]: { sources: source_id },
  });
  res.json({ message });
});

module.exports = router;
