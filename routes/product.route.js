const express = require("express");
const router = express.Router();
const {
  getHighestRated,
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

// Get top 4 highest-rated products
router.get("/hightestrated", getHighestRated, getAllProducts);

// All other routes
router.route("/").get(getAllProducts).post(createProduct);

router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
