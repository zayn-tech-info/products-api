const Product = require("../models/product.model");
const qs = require("qs");

exports.getAllProducts = async (req, res) => {
  try {
    const filterParams = { ...req.query };
    delete filterParams.sort;
    delete filterParams.fields

    const queryStr = JSON.stringify(filterParams).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const mongoQuery = JSON.parse(queryStr);
    console.log("Filter:", mongoQuery);

    let query = Product.find(mongoQuery);

    let sortBy = "-createdAt";
    if (req.query.sort) {
      sortBy = req.query.sort.split(",").join(" ");
    }
    query = query.sort(sortBy);
    console.log("Sort:", sortBy);

    // Limiting fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    // Execute query
    const products = await query;

    res.status(200).json({
      status: "success",
      counts: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      status: "Success",
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productToUpdate = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "Success",
      data: {
        productToUpdate,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error.message,
    });
  }
};
