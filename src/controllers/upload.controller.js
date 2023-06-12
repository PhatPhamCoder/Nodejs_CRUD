const constantNotify = require("../Utils/contanst");
const uploadService = require("../services/upload.service");
const db = require("../models/connectDb");
const tableName = "images";
const fs = require("fs");
const sharp = require("sharp");
const Image = require("../models/upload.model");
const directoryPath = __basedir + "/uploads/images/";
const dirThumb = "./uploads/thumb";

// Upload image
exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.send({
        result: false,
        error: [{ msg: constantNotify.VALIDATE_FILE }],
      });
    }

    if (req.file.size <= 2000000) {
      // console.log(req.file.path);
      const imageName = req.file.filename;
      // console.log("Check Image name::", imageName);

      await sharp(req.file.path)
        .resize({ width: 150, height: 150 })
        .toFile(`uploads/thumb/` + req?.file?.filename, (err) => {
          if (err) {
            return res.send({
              result: false,
              error: [err],
            });
          }

          uploadService.upload(imageName, (err, res_) => {
            if (err) {
              return res.send({
                result: false,
                error: [{ msg: constantNotify.ERROR }],
              });
            }
            return res.send({
              result: true,
              data: { msg: constantNotify.ADD_DATA_SUCCESS },
            });
          });
        });
    } else {
      return res.send({
        result: false,
        error: [{ msg: constantNotify.VALIDATE_FILE_SIZE }],
      });
    }
  } catch (error) {
    return res.send({
      result: false,
      error: [error],
    });
  }
};

// get image by Id
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;

    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }

      conn.query(
        `SELECT id FROM ${tableName} WHERE id = ?`,
        id,
        (err, dataRes) => {
          if (err) {
            return res.send({
              result: false,
              error: [err],
            });
          }

          if (dataRes.length === 0) {
            return res.send({
              result: false,
              error: [{ msg: `Hình ảnh ${constantNotify.NOT_EXITS}` }],
            });
          }
          conn.query(
            `SELECT file_src FROM ${tableName} WHERE id = ?`,
            id,
            (err, dataRes_) => {
              if (err) {
                return res.send({
                  result: false,
                  error: [{ msg: constantNotify.ERROR }],
                });
              }
              if (
                dataRes_.length !== 0 &&
                !fs.existsSync(directoryPath + dataRes_[0]?.file_src)
              ) {
                return res.send({
                  result: false,
                  error: [{ msg: `Hình ảnh ${constantNotify.NOT_EXITS}` }],
                });
              }
              uploadService.getById(id, (err, dataRes) => {
                if (err) {
                  return res.send({
                    result: false,
                    error: [{ msg: constantNotify.ERROR }],
                  });
                }
                return res.send({
                  result: true,
                  data: dataRes,
                });
              });
            },
          );
        },
      );
      conn.release();
    });
  } catch (error) {
    return res.send({
      result: false,
      error: [{ msg: constantNotify.ERROR }],
    });
  }
};

// Delete Image
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          result: false,
          error: { msg: constantNotify.ERROR },
        });
      }

      conn.query(
        `SELECT id FROM ${tableName} WHERE id = ?`,
        id,
        (err, dataRes) => {
          if (err) {
            return res.send({
              result: false,
              error: [err],
            });
          }
          if (dataRes?.length === 0) {
            return res.send({
              result: false,
              error: {
                msg: `ID ${constantNotify.NOT_EXITS}`,
              },
            });
          }

          conn.query(
            `SELECT file_src FROM ${tableName} WHERE id = ?`,
            id,
            (err, dataRes_) => {
              if (err) {
                return res.send({
                  result: false,
                  error: [{ msg: constantNotify.ERROR }],
                });
              }
              // Xóa file trong server
              if (dataRes_.length !== 0) {
                if (fs.existsSync(directoryPath + dataRes_[0]?.file_src)) {
                  // fs.existsSync(directoryPath + dataRes_[0]?.file_src);
                  fs.unlinkSync(directoryPath + dataRes_[0]?.file_src);
                } else {
                  return res.send({
                    result: false,
                    error: [{ msg: `Hình ảnh ${constantNotify.NOT_EXITS}` }],
                  });
                }
              }
              uploadService.delete(id, (err, res_) => {
                if (err) {
                  return res.send({
                    result: false,
                    error: [err],
                  });
                }
                return res.send({
                  result: true,
                  data: {
                    msg: `${constantNotify.DELETE_DATA_SUCCESS} có ID ${id}`,
                  },
                });
              });
            },
          );
        },
      );
      conn.release();
    });
  } catch (error) {
    return res.send({
      result: false,
      error: [{ error }],
    });
  }
};

// getAll
exports.getAll = async (req, res) => {
  try {
    const { limit } = req.query;
    uploadService.getAll(limit, (err, dataRes) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }
      return res.send({
        result: true,
        data: dataRes,
      });
    });
  } catch (error) {
    return res.send({
      result: false,
      error: [{ msg: constantNotify.ERROR }],
    });
  }
};

// Update
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const imageName = req.file.filename;
    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }
      conn.query(
        `SELECT id FROM ${tableName} WHERE id = ?`,
        id,
        (err, dataRes) => {
          if (err) {
            return res.send({
              result: false,
              error: [err],
            });
          }
          if (dataRes.length === 0) {
            return res.send({
              result: false,
              error: [{ msg: `Hình ảnh ${constantNotify.NOT_EXITS}` }],
            });
          }
          conn.query(
            `SELECT file_src FROM ${tableName} WHERE id = ?`,
            id,
            (err, dataRes_) => {
              if (err) {
                return res.send({
                  result: false,
                  error: [err],
                });
              }
              if (dataRes_.length !== 0) {
                fs.unlinkSync(directoryPath + dataRes_[0]?.file_src);
              }
              const image = new Image({
                file_src: imageName,
                updated_at: Date.now(),
              });
              delete created_at;

              uploadService.update(id, image, (err, res_) => {
                if (err) {
                  return res.send({
                    result: false,
                    error: [err],
                  });
                }

                return res.send({
                  result: true,
                  data: image,
                });
              });
            },
          );
        },
      );
      conn.release();
    });
  } catch (error) {
    return res.send({
      result: false,
      error: [{ error }],
    });
  }
};
