const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

let upload;
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "products",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
  });

  if (!storage) {
    throw new Error("An error occured try again later");
  }
  upload = multer({ storage });
} catch (error) {
  console.error("Cloudinary config error:", error);
  upload = multer({ dest: "uploads/" });
}

module.exports = { upload };
