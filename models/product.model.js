const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Description is a required field"],
  },
  category: {
    type: String,
    trim: true,
    enum: [
      "Electronics",
      "Clothing",
      "Food",
      "Gadgets",
      "Furniture",
      "Books",
      "Beauty",
      "Sports",
      "Other",
    ],
    required: true,
  },
  images: {
    type: String,
    required: [true, "Please provide at least one image for this product"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: 0,
  },
  salePrice: {
    type: Number,
    min: 0,
    default: null,
  },
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  brand: {
    type: String,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
