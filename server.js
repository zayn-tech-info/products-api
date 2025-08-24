const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

const app = require("./app");
const morgan = require("morgan");

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.listen(port, () => {
  console.log("Server already started...");
});
