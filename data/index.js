const fs = require("fs");
const Product = require("../models/product.model");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env.local" });

const connectToDB = require("../db/db");

const products = JSON.parse(fs.readFileSync("./data/product.json", "utf-8"));

connectToDB();

const deleteProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    console.log("Products successfully deleted");
  } catch (error) {
    console.log("An error occoured, try again");
  }
  process.exit();
};

const importProducts = async (req, res) => {
  try {
    await Product.create(products);
    console.log("Products added successfully");
  } catch (error) {
    console.log("An error occoured, try again");
  }
  process.exit();
};

if (process.argv[2] === "--delete") {
  deleteProducts();
} else if (process.argv[2] === "--import") {
  importProducts();
}
