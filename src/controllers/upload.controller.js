const constantNotify = require("../Utils/contanst");
const uploadService = require("../services/upload.service");
const db = require("../models/connectDb");
const tableName = "images";
const fs = require("fs");
const sharp = require("sharp");
const Image = require("../models/upload.model");
const directoryPath = __basedir + "/uploads/images/";
const directoryThumb = __basedir + "/uploads/thumb/";
const XLSX = require("xlsx");
const bcrypt = require("bcrypt");
const readXlsxFile = require("read-excel-file/node");
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

          const image = new Image({
            file_src: imageName,
            created_at: Date.now(),
          });
          delete updated_at;

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
    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }
      conn.query(
        `SELECT file_src,id FROM ${tableName} WHERE id = ?`,
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
            async (err, dataRes_) => {
              if (err) {
                return res.send({
                  result: false,
                  error: [err],
                });
              }
              if (
                dataRes_.length !== 0 &&
                fs.existsSync(directoryPath + dataRes_[0]?.file_src) &&
                fs.existsSync(directoryThumb + dataRes_[0]?.file_src)
              ) {
                await fs.unlinkSync(directoryPath + dataRes_[0]?.file_src);
                await fs.unlinkSync(directoryThumb + dataRes_[0]?.file_src);
              }

              await sharp(req.file.path)
                .resize({ width: 150, height: 150 })
                .toFile(`uploads/thumb/` + req?.file?.filename, (err) => {
                  if (err) {
                    return res.send({
                      result: false,
                      error: [err],
                    });
                  }
                  const image = new Image({
                    file_src: req.file.filename,
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

// import excel
exports.importExcel = async (req, res) => {
  try {
    // const password = "OPTECH@123";
    // // Hash Password
    // const salt = await bcrypt.genSalt(10);
    // const hashPassword = await bcrypt.hash(password, salt);
    // console.log(hashPassword);

    // Read File Excel từ đường dẫn import
    const workBook = XLSX.readFile(req?.file?.path);
    // Get Sheet [0] in file excel
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    // Convert data to string (sheet_to_json of XLSX Lib)
    const dataExcel = XLSX.utils.sheet_to_json(workSheet);
    // console.log("check dataExcel::", dataExcel);
    if (dataExcel?.length > 1000) {
      return res.send({
        result: false,
        error: [{ msg: constantNotify.DATALIMIT1000 }],
      });
    }
    const queryPromse = [];
    dataExcel?.forEach((item, index) => {
      queryPromse.push(
        new Promise((resolve, reject) => {
          const query = `SELECT account FROM tbl_admin WHERE account LIKE "%${item["account"]}%"`;
          db.query(query, (err, dataRes) => {
            if (err) {
              reject(err);
            }
            resolve({ dataRes, index: ++index });
          });
        }),
      );
    });
    await Promise.all(queryPromse)
      .then((data) => {
        // console.log("check data::", data);
        const dataSame = [];
        data?.forEach((item) => {
          // console.log("Check item::",item);
          // console.log("item.dataRes_", item.dataRes_);
          if (item.dataRes?.length > 0) {
            dataSame.push(item.index);
          }
        });
        // console.log("Check Datasame::", dataSame);
        return dataSame;
      })
      .then(async (data) => {
        // console.log(data);
        if (data?.length > 0) {
          return res.send({
            result: false,
            error: [
              { msg: `Tài khoản admin STT ${data.join()} đã được sử dụng` },
            ],
          });
        }

        // let dataAdmin = [];
        const dataAdmin = dataExcel?.map((item) => {
          const password = item["password"];
          const salt = bcrypt.genSaltSync(10);
          const hashPassword = bcrypt.hashSync(password, salt);
          return {
            name: item["name"],
            password: hashPassword,
            email: item["email"],
            account: item["account"],
            active: item["active"],
            created_at: Date.now(),
          };
        });

        // console.log("Check dataAdmin::", dataAdmin);
        uploadService.importExcel(dataAdmin, (err, res_) => {
          if (err) {
            return res.send({
              result: false,
              error: [err],
            });
          }
          return res.send({
            result: true,
            data: { msg: constantNotify.ADD_DATA_SUCCESS },
          });
        });
      });
  } catch (error) {
    return res.send({
      result: false,
      error: [{ error }],
    });
  }
};
