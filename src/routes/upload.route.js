const router = require("express").Router();
const { body } = require("express-validator");
const uploadController = require("../controllers/upload.controller");
const upload = require("../middlewares/upload.middleware");
module.exports = (app) => {
  router.post(
    "/",
    upload.single("image") || upload.single("pdf"),
    uploadController.upload,
  );
  router.get("/get-by-id/:id", uploadController.getById);
  router.get("/get-all", uploadController.getAll);
  router.delete("/delete/:id", uploadController.delete);
  router.put("/update/:id", upload.single("image"), uploadController.update);
  app.use("/api/v1/upload", router);
};
