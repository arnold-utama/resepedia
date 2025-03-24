const errorHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid or expired token";
  } else if (error.name === "SequelizeValidationError") {
    statusCode = 400;
    message = error.errors.map((err) => err.message).join(", ");
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
