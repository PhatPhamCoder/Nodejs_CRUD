const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const { apiLimiter } = require("./src/middlewares/rateLimitMiddleware");

require("dotenv").config();
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**Fix cors 206 load banlance video */
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Apply the rate limiting middleware to API calls only
// app.use("/api", apiLimiter);

// Xem hình ảnh
app.use(express.static("uploads"));

global.__basedir = __dirname;

const port = process.env.PORT;
const base_url = process.env.BASE_URL;

// import router
require("./src/routes/admin.route")(app);
require("./src/routes/role.route")(app);
require("./src/routes/upload.route")(app);
require("./src/routes/receipt.route")(app);

app.listen(port, () => {
  console.log(`🚀 Server is running at ${base_url}:${port}`);
});
