const  mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    enum: ["Electronics", "Clothing", "Food", "Gadgets", "Other"],
    required: true,
  },
  image: {
    trim: true,
    type: String,
    required: [true, "Please provide an image for this product"],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  },
});

const Product = mongoose.model("Product", productSchema)

module.exports = Product