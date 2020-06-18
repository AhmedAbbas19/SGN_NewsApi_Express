const express = require("express");
const usersRouter = require("./routers/users");
const newsRouter = require("./routers/news");
const sourcesRouter = require("./routers/sources");
const { errorHandler } = require("./handlers/error");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "https://sgn-news.herokuapp.com",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/users", usersRouter);
app.use("/news", newsRouter);
app.use("/sources", sourcesRouter);

// Error Handler
app.use(errorHandler);

module.exports = app;
