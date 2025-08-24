const express = require("express");
const productsRoute = require("./routes/product.route");
const connectToDB = require("./db/db");

const app = express();
app.use(express.json());
app.use("/api/v1/products", productsRoute);

connectToDB();

app.use((err, req, res, next) => {
  console.error("Global error:", err);

  if (err.name === "MulterError") {
    return res.status(400).json({
      status: "fail",
      message: "File upload error: " + err.message,
    });
  }

  res.status(500).json({
    status: "fail",
    message: "Internal server error",
  });
});

module.exports = app;
