const router = require("express").Router();
const { body } = require("express-validator");
const adminControler = require("../controllers/admin.controller");
const constantNotify = require("../Utils/contanst");
const { verifyToken } = require("../middlewares/init_jwt");
const { verifyLimiter } = require("../middlewares/rateLimitMiddleware");

module.exports = (app) => {
  router.get("/getall", adminControler.getall);
  router.get("/getbyid/:id", verifyToken, adminControler.getById);
  // Tạo người dùng chỉ cho phép admin sau khi đăng nhập có token mới tạo đc
  router.post("/register", adminControler.register);
  router.post(
    "/login",
    [
      body("account", constantNotify.ACCOUNT_NOTEMPTY).notEmpty(),
      body("password", constantNotify.PASSWORD_NOTEMPTY).notEmpty(),
      body("password", constantNotify.VALIDATE_PASSWORD).isLength({ min: 8 }),
    ],
    adminControler.login,
  );

  router.delete("/delete/:id", adminControler.delete);
  router.put("/update-admin/:id", adminControler.update);
  router.post("/refresh-token", adminControler.refreshToken);

  // Should add rate limit at OTP
  router.post("/send-otp", adminControler.sendOTP);
  router.post("/verify-otp/:id", adminControler.verifyOTP);
  router.post("/resend-otp", adminControler.reSendOTP);

  app.use("/api/v1/admin", router);
};
