const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const connection = require("./src/models/connectDb");

require("dotenv").config();
app.use(morgan("dev"));
app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT;
const base_url = process.env.BASE_URL;

// import router
require("./src/routes/admin.route")(app);
app.listen(port, () => {
  console.log(`🚀 Server is running at ${base_url}:${port}`);
});
