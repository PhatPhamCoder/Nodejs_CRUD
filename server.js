const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");

require("dotenv").config();
app.use(morgan("dev"));
app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// xem hình ảnh
app.use(express.static("uploads"));

global.__basedir = __dirname;

const port = process.env.PORT;
const base_url = process.env.BASE_URL;

// import router
require("./src/routes/admin.route")(app);
require("./src/routes/role.route")(app);
require("./src/routes/upload.route")(app);

app.listen(port, () => {
  console.log(`🚀 Server is running at ${base_url}:${port}`);
});
