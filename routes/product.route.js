const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const {
  getHighestRated,
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} = require("../controllers/product.controller");

router.route("/hightestrated").get(getHighestRated, getAllProducts);
router.route("/get-products-stats").get(getProductStats);

router
  .route("/")
  .get(getAllProducts)
  .post(upload.single("image"), createProduct);

router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
