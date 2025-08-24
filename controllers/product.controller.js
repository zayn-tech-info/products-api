const Product = require("../models/product.model");
const ApiFeatures = require("../utils/ApiFeatures");

exports.getHighestRated = (req, _, next) => {
  req.query.limit = "4";
  req.query.sort = "-totalRatings";
  next();
};

exports.getAllProducts = async (req, res) => {
  try {
    // const features = new ApiFeatures(Product.find(), req.query)
    //   .sort()
    //   .paginate()
    //   .filter()
    //   .limitFields();

    // const products = await features;

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
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "Please upload an image file",
      });
    }
    const product = await Product.create({ ...req.body, image: req.file.path });

    res.status(201).json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: req.file.path },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getProductStats = async (req, res) => {
  try {
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
      res.status(404).json({
        status: "failed",
        message: "Product with specified field not found",
      });
    }
    res.status(200).json({
      status: "Success",
      count: productStat.length,
      data: {
        productStat,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};
