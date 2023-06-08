const router = require("express").Router();
const { body } = require("express-validator");
const adminControler = require("../controllers/admin.controller");
const jwtMiddleware = require("../middlewares/jwt.middleware");
const constantNotify = require("../Utils/contanst");
module.exports = (app) => {
  router.get("/getall", jwtMiddleware.isAuth, adminControler.getall);
  router.get("/getbyid/:id", jwtMiddleware.isAuth, adminControler.getById);
  // Tạo người dùng chỉ cho phép admin sau khi đăng nhập có token mới tạo đc
  router.post("/register", jwtMiddleware.isAuth, adminControler.register);
  router.post(
    "/login",
    [
      body("account", constantNotify.ACCOUNT_NOTEMPTY).notEmpty(),
      body("password", constantNotify.PASSWORD_NOTEMPTY).notEmpty(),
      body("password", constantNotify.VALIDATE_PASSWORD).isLength({ min: 8 }),
    ],
    adminControler.login,
  );
  router.delete("/delete/:id", jwtMiddleware.isAuth, adminControler.delete);
  router.put("/update-admin/:id", jwtMiddleware.isAuth, adminControler.update);
  app.use("/api/v1/admin", router);
};
