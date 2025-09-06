const express = require("express");
const rateLimit = require("express-rate-limit");
const helemt = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const sanitize = require("express-mongo-sanitize");

const globalError = require("./controllers/error.controller");
const connectToDB = require("./db/db");
const CustomError = require("./utils/customError");
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const productsRoute = require("./routes/product.route");


const app = express();
app.use(helemt());

let limiter = rateLimit({
  max: 2,
  windowMs: 60 * 60 * 1000,
  message:
    "We have received too many requests from this IP, please try again after 1hr",
});

app.use("/api/", limiter);
app.use(express.json());

app.use(sanitize());
app.use(xss());
app.use(hpp({ whitelist: ["ratings", "avgratings", 'category'] }));

app.use("/api/v1/products", productsRoute);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

connectToDB();

app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server`,
    404
  );
  next(err);
});

app.use(globalError);

module.exports = app;
