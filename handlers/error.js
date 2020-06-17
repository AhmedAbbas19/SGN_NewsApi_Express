const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 422;
  res
    .status(statusCode)
    .json(
      statusCode < 500
        ? { ...error, message: error.message }
        : "Something went wrong!"
    );
};

module.exports = { errorHandler };
