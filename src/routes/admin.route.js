const router = require("express").Router();
const { body } = require("express-validator");
const adminControler = require("../controllers/admin.controller");
const jwtMiddleware = require("../middlewares/jwt.middleware");
const constantNotify = require("../Utils/contanst");
const { verifyToken, signAccesToken } = require("../middlewares/init_jwt");

module.exports = (app) => {
  router.get("/getall", verifyToken, adminControler.getall);
  router.get("/getbyid/:id", verifyToken, adminControler.getById);
  // Tạo người dùng chỉ cho phép admin sau khi đăng nhập có token mới tạo đc
  router.post("/register", verifyToken, adminControler.register);
  router.post(
    "/login",
    [
      body("account", constantNotify.ACCOUNT_NOTEMPTY).notEmpty(),
      body("password", constantNotify.PASSWORD_NOTEMPTY).notEmpty(),
      body("password", constantNotify.VALIDATE_PASSWORD).isLength({ min: 8 }),
    ],
    adminControler.login,
  );

  router.delete("/delete/:id", verifyToken, adminControler.delete);
  router.put("/update-admin/:id", verifyToken, adminControler.update);
  router.post("/refresh-token", adminControler.refreshToken);

  app.use("/api/v1/admin", router);
};
