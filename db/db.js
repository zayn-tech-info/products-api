const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    const response = await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      // useUnifiedTopology: true
    });
    // console.log(response);
    console.log("Database connected succefully");
  } catch (error) {
    console.log(`An error occurred: ${error}`);
  }
};


module.exports = connectToDB