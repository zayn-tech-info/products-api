const express = require("express");
const productsRoute = require("./routes/product.route");
const connectToDB = require("./db/db");

const app = express();
app.use(express.json());
app.use("/api/v1/products", productsRoute);

connectToDB()

module.exports = app;
