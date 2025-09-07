const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log(err.name, err.message);
  console.log("Uncaught exception occurred, shutting down...");
  process.exit(1);
});

const app = require("./app");
const morgan = require("morgan");

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const server = app.listen(port, () => {
  console.log(`Server already started...Port: ${port}`);
});

process.on("unHandleRejection", (err) => {
  console.log(err.name, err.message);
  console.log(err);
  console.log("unHandleRejection exception occured, shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
