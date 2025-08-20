const Product = require("../models/product.model");
const qs = require("qs");

exports.getAllMovies = async (req, res) => {
  try {
/*     let queryObj = qs.parse(req.query);
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const mongoQuery = JSON.parse(queryStr);
    console.log(mongoQuery); */

     
    // const products = await Product.find(monoQuery)
    
     const products = await Product.find()
       .where("ratings")
       .lt(req.query.ratings)
       .where("price")
       .gte(req.query.price);
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

exports.getMovie = async (req, res) => {
  try {
    const movie = await Product.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.deleteMovie = async (req, res) => {
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

exports.createMovie = async (req, res) => {
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

exports.updateMovie = async (req, res) => {
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
