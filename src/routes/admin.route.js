const router = require("express").Router();
const adminControler = require("../controllers/admin.controller");

module.exports = (app) => {
  router.post("/register", adminControler.register);
  app.use("/api/v1/admin", router);
};
