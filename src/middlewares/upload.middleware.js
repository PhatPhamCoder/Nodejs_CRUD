const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Đường dẫn lưu hình ảnh
const dir = "./uploads/images";

// Check xem đã tạo folder chứa ảnh chưa nếu chưa sẽ tự tạo 1 folder
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${dir}`);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "_" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupport file format" }, null);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2000000 }, //Limit fileSize: 2MB
});

module.exports = upload;
