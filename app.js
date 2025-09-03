const express = require("express");
const productsRoute = require("./routes/product.route");
const userRouter = require("./routes/user.route")
const globalError = require("./controllers/error.controller");
const connectToDB = require("./db/db");
const CustomError = require("./utils/customError");


const app = express();
app.use(express.json());
app.use("/api/v1/products", productsRoute);
app.use("/api/v1/users", userRouter);

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
