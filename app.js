const express = require("express");
const usersRouter = require("./routers/users");
const newsRouter = require("./routers/news");
const { errorHandler } = require("./handlers/error");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/users", usersRouter);
app.use("/news", newsRouter);

// Error Handler
app.use(errorHandler);

module.exports = app;
