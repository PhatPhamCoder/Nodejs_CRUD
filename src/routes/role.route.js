const router = require("express").Router();
const { body } = require("express-validator");
const roleController = require("../controllers/role.controller");
module.exports = (app) => {
  router.get("/getbyid/:id", roleController.getById);
  router.post(
    "/create-role",
    [body("name", "Không được để trống").notEmpty()],
    roleController.create,
  );
  router.delete("/delete/:id", roleController.delete);
  router.put("/update-role/:id", roleController.update);
  app.use("/api/v1/role", router);
};
