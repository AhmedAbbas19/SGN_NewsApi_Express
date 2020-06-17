const express = require("express");
require("express-async-errors");
const authenticate = require("../middlewares/auth");

const { NewsAPIKey } = require("../config");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(NewsAPIKey);

const router = express.Router();

router.get("/", authenticate, async (req, res, next) => {
  if (!req.user.sources.length)
    return res.status(422).json({ message: "You have no subscribtions" });

  const response = await newsapi.v2.everything({
    sources: req.user.sources.join(","),
  });
  res.json(response);
});

router.get("/sources", authenticate, async (req, res, next) => {
  const response = await newsapi.v2.sources();
  res.json(response);
});

module.exports = router;
