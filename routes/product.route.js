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

router.get("/get-products-stats", getProductStats);

router.get("/", getAllProducts);
router.post("/", upload.single("image"), createProduct);

router.get("/:id", getProduct);
router.patch("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
