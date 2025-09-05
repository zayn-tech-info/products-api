const CustomError = require("../utils/customError");

const devError = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stackTrace: err.stack,
    err,
  });
};
const prodError = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "fail",
      message: "Something went wrong, try again!",
    });
  }
};

const castError = (error) => {
  const msg = `Invaid value for ${error.path} : ${error.value}`;
  return new CustomError(msg, 400);
};
const duplicateKeyErrorHandle = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  const msg = `${field} with ${value} already exist. Please use another ${field}`;

  return new CustomError(msg, 400);
};

const vaildationErrorHandler = (error) => {
  const err = Object.values(error.errors).map((val) => {
    return val.message;
  });
  const messages = err.join(". ");
  const msg = `invalid input data: ${messages}`;
  return new CustomError(msg, 400);
};

const tokenExpiredErrorHandler = () => {
  const msg = "Session expired, please login again";
  return new CustomError(msg, 404);
};

const JsonWebTokenErrorHandler = () => {
  return new CustomError("Invaild token, Please login again", 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";

  if (process.env.NODE_ENV === "development") {
    devError(res, err);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = castError(err);
    if (err.code === 11000) {
      err = duplicateKeyErrorHandle(err);
    }
    if (err.name === "ValidationError") {
      err = vaildationErrorHandler(err);
    }
    if (err.name === "TokenExpiredError") {
      err = tokenExpiredErrorHandler(err);
    }
    if (err.name === "JsonWebTokenError") {
      err = JsonWebTokenErrorHandler(err);
    }

    prodError(res, err);
  }
};
