const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(`An error occurred: ${error.message}`);
  }
};

module.exports = connectToDB;