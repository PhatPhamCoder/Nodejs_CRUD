const router = require("express").Router();
const adminControler = require("../controllers/admin.controller");

module.exports = (app) => {
  router.post("/register", adminControler.register);
  router.post("/login", adminControler.login);
  app.use("/api/v1/admin", router);
};
