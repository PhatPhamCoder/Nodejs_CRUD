const constantNotify = require("../Utils/contanst");
const uploadService = require("../services/upload.service");
const db = require("../models/connectDb");
const tableName = "images";
const fs = require("fs");
const Image = require("../models/upload.model");

const directoryPath = __basedir + "/uploads/images/";

// Upload image
exports.upload = async (req, res) => {
  try {
    const image = req.file.filename;

    uploadService.upload(image, (err, res_) => {
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
              // console.log("check Image name::", dataRes_[0]?.file_src);
              // Xóa file trong server
              if (dataRes_.length !== 0) {
                fs.unlinkSync(directoryPath + dataRes_[0]?.file_src);
              }
              uploadService.delete(id, (err, dataRes) => {
                if (err) {
                  return res.send({
                    result: false,
                    error: [err],
                  });
                }
                return res.send({
                  result: true,
                  data: { msg: constantNotify.DELETE_DATA_SUCCESS },
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
    uploadService.getAll((err, dataRes) => {
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
