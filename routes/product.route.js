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

const {
  protectRoute,
  restrictRoute,
} = require("../controllers/auth.controller");

router.get(
  "/hightestrated",
  protectRoute,
  (req, res, next) => {
    req.query.limit = req.query.limit || "4";
    req.query.sort = req.query.sort || "-totalRatings";
    next();
  },
  getAllProducts
);

router.get("/get-products-stats", protectRoute, getProductStats);

router.get("/", protectRoute, getAllProducts);
router.post(
  "/",
  protectRoute,
  restrictRoute("admin"),
  upload.single("image"),
  createProduct
);

router.get("/:id", getProduct);
router.patch(
  "/:id",
  protectRoute,
  restrictRoute("admin"),
  upload.single("image"),
  updateProduct
);
router.delete("/:id", protectRoute, restrictRoute("admin"), deleteProduct);

module.exports = router;
