const Product = require("../models/product.model");
const ApiFeatures = require("../utils/ApiFeatures");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");

exports.getAllProducts = asyncErrorHandler(async (req, res) => {
  const features = new ApiFeatures(Product.find(), req.query)
    .sort()
    .paginate()
    .filter()
    .limitFields();

  const products = await features.query;

  res.status(200).json({
    status: "success",
    counts: products.length,
    data: { products },
  });
});

exports.getProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    const err = new CustomError("Product with this not found", 404);
    next(err);
  }
  res.status(200).json({
    status: "success",
    data: { product },
  });
});

exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  if (!req.file || !req.file.path) {
    const err = new CustomError("Please upload an image file", 400);
    return next(err);
  }

  const product = await Product.create({
    ...req.body,
    images: req.file.path,
  });

  res.status(201).json({
    status: "success",
    data: { product },
  });
});

exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
  const payload = { ...req.body };
  if (req.file && req.file.path) payload.image = req.file.path;
  const product = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    const err = new CustomError("Product with this not found", 404);
    next(err);
  }
  res.status(200).json({
    status: "success",
    data: { product },
  });
});

exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    const err = new CustomError("Product with this id is not found", 404);
    next(err);
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getProductStats = asyncErrorHandler(async (req, res, next) => {
  const productStat = await Product.aggregate([
    { $match: { ratings: { $lte: 4.5 } } },
    {
      $group: {
        _id: "$totalRatings",
        avgRating: { $avg: "$ratings" },
        avgPrice: { $avg: "$price" },
        minRating: { $min: "$ratings" },
        maxRating: { $max: "$ratings" },
        productCount: { $sum: 1 },
      },
    },
    { $sort: { minRating: 1 } },
    { $match: { avgPrice: { $gt: 60 } } },
  ]);

  if (productStat <= 0) {
    const err = new CustomError("Product with specified field not found", 404);
    next(err);
  }
  res.status(200).json({
    status: "Success",
    count: productStat.length,
    data: {
      productStat,
    },
  });
});
