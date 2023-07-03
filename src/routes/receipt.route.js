const router = require("express").Router();
const { body } = require("express-validator");
const receiptControler = require("../controllers/receipt.controller");
const constantNotify = require("../Utils/contanst");
const { verifyToken } = require("../middlewares/init_jwt");

module.exports = (app) => {
  //   router.get("/getall", receiptControler.getAll);
  router.post("/create/:id", receiptControler.createReceipt);
  router.get("/getbyid/:userid/:id", receiptControler.getById);
  router.get("/payment/:id", receiptControler.payment);
  app.use("/api/v1/receipt", router);
};
