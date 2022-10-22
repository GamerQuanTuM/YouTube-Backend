const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    err.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    err.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    err.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    err.statusCode = 400;
  }

  if (err.name === "CastError") {
    err.msg = `No item found with id : ${err.value}`;
    err.statusCode = 404;
  }

  res
    .status(err.statusCode)
    .json({ success: false, status: err.statusCode, message: err.message });
};

export default errorMiddleware;
