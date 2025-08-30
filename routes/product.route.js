const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} = require("../controllers/product.controller");

router.get(
  "/hightestrated",
  (req, res, next) => {
    req.query.limit = req.query.limit || "4";
    req.query.sort = req.query.sort || "-totalRatings";
    next();
  },
  getAllProducts
);
router.route("/get-products-stats").get(getProductStats);
router
  .route("/")
  .get(getAllProducts)
  .post(upload.single("image"), createProduct);
router
  .route("/:id")
  .get(getProduct)
  .patch(upload.single("image"), updateProduct)
  .delete(deleteProduct);

module.exports = router;
