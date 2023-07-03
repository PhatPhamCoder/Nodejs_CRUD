const { validationResult } = require("express-validator");
const db = require("../models/connectDb");
const regex = require("../Utils/regex");
const constantNotify = require("../Utils/contanst");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin.model");
const adminService = require("../services/admin.service");
const jwtDecode = require("jwt-decode");
const { signAccesToken, signRefreshToken } = require("../middlewares/init_jwt");
const tableName = "tbl_admin";
const JWT = require("jsonwebtoken");
const sendEmail = require("./email.controller");
const { networkInterfaces } = require("os");
const otpGenerator = require("otp-generator");

// Register
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({
        result: false,
        errors: errors.array(),
      });
    }
    const { name, account, email, password, active, role_id } = req.body;
    // Xác thực tên tài khoản là chữ thường và số
    if (!regex.regexAccount.test(account)) {
      return res.send({
        result: false,
        error: [
          {
            param: "account",
            msg: constantNotify.VALIDATE_ACCOUNT,
          },
        ],
      });
    }

    if (!regex.regexPass.test(password)) {
      return res.send({
        result: false,
        error: [
          {
            param: "password",
            msg: constantNotify.VALIDATE_PASSWORD,
          },
        ],
      });
    }

    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          result: false,
          error: [{ msg: constantNotify.ERROR }],
        });
      }

      // account exist
      conn.query(
        `SELECT account FROM ${tableName} WHERE account = ?`,
        account,
        async (err, dataRes) => {
          //   console.log(dataRes);
          if (err) {
            return res.send({
              result: false,
              error: [
                {
                  msg: constantNotify.ERROR,
                },
              ],
            });
          }
          if (dataRes?.length !== 0) {
            return res.send({
              result: false,
              error: [
                {
                  param: "account",
                  msg: `Account ${constantNotify.ALREADY_EXIST}`,
                },
              ],
            });
          }
          conn.query(
            `SELECT email FROM ${tableName} WHERE email = ?`,
            email,
            async (err, dataRes_) => {
              //   console.log(dataRes);
              if (err) {
                return res.send({
                  result: false,
                  error: [
                    {
                      msg: constantNotify.ERROR,
                    },
                  ],
                });
              }
              if (dataRes_?.length !== 0) {
                return res.send({
                  result: false,
                  error: [
                    {
                      param: "email",
                      msg: `Email ${constantNotify.ALREADY_EXIST}`,
                    },
                  ],
                });
              }
              // Hash Password
              const salt = await bcrypt.genSalt(10);
              const hashPassword = await bcrypt.hash(password, salt);
              const OTP = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
              });

              const hashOTP = await bcrypt.hash(OTP, salt);
              const dataSendEmail = {
                to: email,
                text: "Hey user",
                subject: "[OPTECH] Mã OTP xác thực tài khoản",
                html: `Hi bạn,
                    Chúng tôi cảm ơn bạn đã tạo tài khoản bên ứng dụng chúng tôi. Bạn vui lòng nhập mã OTP bên dưới tại web <a href="${process.env.REACT_APP}/verify-account/310">chúng tôi</a> sau để kích hoạt tài khoản <br/>
                    Mã OTP của bạn là: <strong>${OTP}</strong> <br/>
                    Bạn vui lòng không chia sẻ mã OTP này để bảo vệ tài khoản của mình nhé!
                    `,
              };

              await sendEmail(dataSendEmail);

              // Data insert
              const admin = new Admin({
                name: name,
                role_id: role_id,
                password: hashPassword,
                email: email,
                account: account,
                type: 0,
                refresh_token: 0,
                OTP: hashOTP,
                active: !active ? 0 : 1,
                expired_on: null,
                created_at: Date.now(),
              });
              delete admin.updated_at;

              adminService.register(admin, async (err, res_) => {
                if (err) {
                  res.send({
                    result: false,
                    error: [err],
                  });
                } else {
                  conn.query(
                    `SELECT name FROM tbl_role WHERE id = ?`,
                    role_id,
                    (err, dataRes) => {
                      if (err) {
                        return res.send({
                          result: false,
                          error: [{ msg: constantNotify.ERROR }],
                        });
                      }
                      admin.id = res_;
                      admin.name_role = dataRes[0]?.name;
                      admin.updated_at = 0;
                      delete admin.password;
                      delete admin.role_id;
                      delete admin.refresh_token;
                      res.send({
                        result: true,
                        data: {
                          msg: constantNotify.ADD_DATA_SUCCESS,
                          insertId: res_,
                          newData: admin,
                        },
                      });
                    },
                  );
                }
              });
            },
          );
        },
      );
      db.releaseConnection(conn);
    });
  } catch (error) {
    res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};

// Active Account
exports.verifyOTP = async (req, res) => {
  try {
    const otp = req.body.otp;
    const userId = req.params.id;
    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          result: false,
          error: [{ msg: constantNotify.ERROR }],
        });
      }

      conn.query(
        `SELECT email,OTP FROM ${tableName} WHERE id = ${userId}`,
        (err, dataRes) => {
          if (err) {
            return res.send({
              result: false,
              error: [err],
            });
          }

          const data = {
            userId,
            otp,
            OTP: dataRes[0]?.OTP,
            email: dataRes[0]?.email,
          };
          adminService.verifyOTP(data, async (err, res_) => {
            if (err) {
              return res.send({
                result: false,
                error: [err],
              });
            }
            const dataSendEmail = {
              to: dataRes[0]?.email,
              text: "Hey user",
              subject:
                "[OPTECH] 🎉 Chúc mừng bạn đã đăng kí tài khoản thành công",
              html: `Hi bạn,
                  Chúng tôi cảm ơn bạn đã tạo tài khoản bên ứng dụng chúng tôi. Bây giờ bạn có thể tiến hành đăng nhập và sử dụng dịch vụ của chúng tôi.<br/>
                  <a href="${process.env.REACT_APP}">Đăng nhập ngay</a>
                  Bạn vui lòng không chia sẻ mã OTP này để bảo vệ tài khoản của mình nhé!
                  `,
            };

            await sendEmail(dataSendEmail);

            return res.send({
              result: true,
              data: { msg: "Xác thực thành công" },
            });
          });
        },
      );

      conn.release();
    });
  } catch (error) {
    return res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};

// Send OTP
exports.reSendOTP = async (req, res) => {
  try {
    const email = req.body.email;
    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log(email, OTP);

    const salt = await bcrypt.genSalt(10);
    const hashOTP = await bcrypt.hash(OTP, salt);

    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }
      conn.query(
        `UPDATE ${tableName} SET OTP = "${hashOTP}" WHERE email = "${email}"`,
        async (err, dataRes) => {
          if (err) {
            return res.send({
              result: false,
              error: [err],
            });
          }
          const dataSendEmail = {
            to: email,
            text: "Hey user",
            subject: "[OPTECH] Mã OTP xác thực tài khoản",
            html: `Hi bạn,
              Chúng tôi cảm ơn bạn đã tạo tài khoản bên ứng dụng chúng tôi. Bạn vui lòng nhập mã OTP bên dưới tại web <a href="${process.env.REACT_APP}/verify-account/310">chúng tôi</a> sau để kích hoạt tài khoản <br/>
              Mã OTP của bạn là: <strong>${OTP}</strong> <br/>
              Bạn vui lòng không chia sẻ mã OTP này để bảo vệ tài khoản của mình nhé!
          `,
          };

          await sendEmail(dataSendEmail);
          return res.send({
            result: true,
            data: { msg: `OTP ${constantNotify.SEND_SUCCESS}` },
          });
        },
      );
      conn.release();
    });
  } catch (error) {
    return res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};

// Login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({
      result: false,
      errors: errors.array(),
    });
  }
  const { account, password } = req.body;
  // console.log({ account, password });

  // Validate Account
  if (!regex.regexAccount.test(account)) {
    return res.send({
      result: false,
      error: [
        {
          param: "account",
          msg: constantNotify.VALIDATE_ACCOUNT,
        },
      ],
    });
  }

  // Validate Password
  if (!regex.regexPass.test(password)) {
    return res.send({
      result: false,
      error: [
        {
          param: "password",
          msg: constantNotify.VALIDATE_PASSWORD,
        },
      ],
    });
  }
  db.getConnection((err, conn) => {
    if (err) {
      return res.send({
        result: false,
        error: [{ msg: constantNotify.ERROR }],
      });
    }
    conn.query(
      `SELECT active FROM ${tableName} WHERE account = "${account}"`,
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
            error: [{ msg: `Nguời dùng ${constantNotify.NOT_EXITS}` }],
          });
        }
        if (dataRes.length !== 0) {
          if (dataRes[0]?.active === 1) {
            adminService.login(account, password, (err, res_) => {
              if (err) {
                return res.send({
                  result: false,
                  msg: [err],
                });
              }
              res.send({
                result: true,
                data: res_,
              });
            });
          }
          if (dataRes[0]?.active === 0) {
            return res.send({
              result: false,
              error: [{ msg: `Người dùng ${constantNotify.NOT_ACTIVE}` }],
            });
          }
        }
      },
    );
    conn.release();
  });
};

// Get All
exports.getall = async (req, res) => {
  try {
    // const limit = 2;
    const offser = 0;
    const limit = req.query.limit;
    // let limit = 10;
    adminService.getall(offser, limit, (err, res_) => {
      // console.log(res_);
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }

      res.send({
        result: true,
        limit: limit,
        data: res_,
      });
    });
  } catch (error) {
    res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};

// getByID
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    adminService.getById(id, (err, res_) => {
      if (err) {
        return res.send({
          result: false,
          error: err,
        });
      }
      res.send({
        result: true,
        data: res_,
      });
    });
  } catch (error) {
    res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};

// Delete
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    adminService.delete(id, (err, res_) => {
      if (err) {
        return res.send({
          result: false,
          error: err,
        });
      }
      res.send({
        result: true,
        data: { msg: `ID ${id}, ${constantNotify.DELETE_DATA_SUCCESS}` },
      });
    });
  } catch (error) {
    res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};

// Update
exports.update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ result: false, error: errors.array() });
    }

    const id = req.params.id;
    const { name, email, account, role_id, active } = req.body;
    // console.log({ id, name, email, account, role_id, active });

    if (!regex.regexAccount.test(account)) {
      return res.send({
        result: false,
        error: [
          {
            param: "account",
            msg: constantNotify.VALIDATE_ACCOUNT,
          },
        ],
      });
    }

    if (!regex.regexEmail.test(email)) {
      return res.send({
        result: false,
        error: [
          {
            param: "email",
            msg: constantNotify.VALIDATE_EMAIL,
          },
        ],
      });
    }

    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          result: false,
          error: [{ msg: constantNotify.ERROR }],
        });
      }

      conn.query(
        `SELECT id FROM ${tableName} WHERE id = ?`,
        id,
        (err, dataRes__) => {
          if (err) {
            return res.send({
              result: false,
              error: [err],
            });
          }
          if (dataRes__.length === 0) {
            return res.send({
              result: false,
              error: [{ msg: `ID ${constantNotify.NOT_EXITS}` }],
            });
          }
          conn.query(
            `SELECT account,id FROM ${tableName} WHERE account = ?`,
            account,
            async (err, dataRes) => {
              if (err) {
                return res.send({
                  result: false,
                  error: { msg: constantNotify.ERROR },
                });
              }
              // console.log(dataRes);
              if (dataRes.length !== 0 && dataRes[0]?.id !== parseInt(id)) {
                await res.send({
                  result: false,
                  error: [
                    {
                      param: "account",
                      msg: `Account ${constantNotify.ALREADY_EXIST}`,
                    },
                  ],
                });
                return;
              }

              conn.query(
                `SELECT email,id FROM ${tableName} WHERE email = ?`,
                email,
                async (err, dataRes_) => {
                  if (err) {
                    return res.send({
                      result: false,
                      error: [{ msg: constantNotify.ERROR }],
                    });
                  }

                  if (
                    dataRes_.length !== 0 &&
                    dataRes_[0]?.id !== parseInt(id)
                  ) {
                    await res.send({
                      result: false,
                      error: [
                        {
                          param: "email",
                          error: `Email ${constantNotify.ALREADY_EXIST}`,
                        },
                      ],
                    });
                    return;
                  }

                  // console.log("check dataRes_::", dataRes_);
                  const admin = new Admin({
                    name: name,
                    role_id: role_id,
                    email: email,
                    account: account,
                    active: !active ? false : true,
                    expired_on: null,
                    updated_at: Date.now(),
                  });
                  // console.log("check Data new::", admin);
                  adminService.update(id, admin, async (err, res_) => {
                    if (err) {
                      res.send({
                        result: false,
                        error: [err],
                      });
                    } else {
                      conn.query(
                        `SELECT name FROM tbl_role WHERE id = ?`,
                        role_id,
                        (err, dataRes) => {
                          if (err) {
                            return res.send({
                              result: false,
                              error: [{ msg: constantNotify.ERROR }],
                            });
                          }
                          admin.id = id;
                          admin.name_role = dataRes[0].name;
                          admin.created_at = 0;
                          delete admin.password;
                          delete admin.role_id;
                          delete admin.refresh_token;
                          delete admin.type;
                          res.send({
                            result: true,
                            data: {
                              msg: constantNotify.UPDATE_DATA_SUCCESS,
                              id,
                              newData: admin,
                            },
                          });
                        },
                      );
                    }
                  });
                },
              );
            },
          );
        },
      );
      db.releaseConnection(conn);
    });
  } catch (error) {
    res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};

exports.refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  const decodeToken = jwtDecode(refreshToken.slice(0, refreshToken.length - 1));
  const userId = decodeToken?.userId;

  await JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
    if (err) {
      const query = `UPDATE ${tableName} SET refresh_token = 0 WHERE id = ${userId}`;
      db.query(query, (err) => {
        if (err) {
          return res.send({ msg: constantNotify.ERROR }, null);
        }
        db.query(
          `SELECT email FROM ${tableName} WHERE id = ?`,
          userId,
          async (err, data_) => {
            if (err) {
              return res.send({ msg: constantNotify.ERROR }, null);
            }
            if (data_[0]?.email) {
              const nets = networkInterfaces();
              const results = {};

              for (const name of Object.keys(nets)) {
                for (const net of nets[name]) {
                  const familyV4Value =
                    typeof net.family === "string" ? "IPv4" : 4;
                  if (net.family === familyV4Value && !net.internal) {
                    if (!results[name]) {
                      results[name] = [];
                    }
                    results[name].push(net.address);
                  }
                }
              }

              const dataSendEmail = {
                to: data_[0]?.email,
                text: "Hey user",
                subject: "[OPTECH] CẢNH BÁO ĐĂNG NHẬP BẤT THƯỜNG",
                html: `Hi bạn,
                    Chúng tôi nghi ngờ tài khoản của bạn đăng nhập bất thường tại địa chỉ IP: ${
                      results["Wi-Fi"][0] || results["Ethernet"][0]
                    }
                    Bạn vui lòng đăng nhập hệ thống và đổi mật khẩu để bảo vệ tài khoản!
                    `,
              };

              await sendEmail(dataSendEmail);
            }
          },
        );
      });
      return res.send({
        result: false,
        error: [err],
      });
    }

    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }

      conn.query(
        `SELECT id,name,refresh_token FROM tbl_admin WHERE refresh_token LIKE "%${refreshToken}%"`,
        async (err, dataRes) => {
          if (err) {
            return res.send({
              result: false,
              error: [err],
            });
          }
          if (dataRes.length === 0) {
            const query = `UPDATE ${tableName} SET refresh_token = 0 WHERE id = ${userId}?`;
            conn.query(query, (err) => {
              if (err) {
                return res.send({ msg: constantNotify.ERROR }, null);
              }
            });
          }

          if (dataRes && dataRes.length > 0) {
            const dataRefresh = {
              userId: dataRes[0].id,
              name: dataRes[0].name,
            };
            const _token = await signAccesToken(dataRefresh);
            const _refreshToken = await signRefreshToken(dataRefresh);

            /**update RefreshToken at DB */
            const updateToken = `UPDATE ${tableName} SET refresh_token = ? WHERE id = ?`;
            conn.query(updateToken, [_refreshToken, userId], (err) => {
              if (err) {
                return result({ msg: constantNotify.ERROR }, null);
              }
            });
            return res.send({
              result: true,
              newAccessToken: _token,
              newRefreshToken: _refreshToken,
            });
          }
        },
      );
      db.releaseConnection(conn);
    });
  });
};

exports.sendOTP = async (req, res) => {
  try {
    const email = req.body.email;

    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          result: false,
        });
      }
      conn.query(
        `SELECT email FROM ${tableName} WHERE email = "${email}"`,
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
              error: [{ msg: `Người dùng ${constantNotify.NOT_EXITS}` }],
            });
          }
          if (dataRes.length !== 0) {
            const OTP = otpGenerator.generate(6, {
              digits: true,
              lowerCaseAlphabets: false,
              upperCaseAlphabets: false,
              specialChars: false,
            });
            adminService.sendOTP;
          }
        },
      );
      conn.release();
    });
  } catch (error) {
    return res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};
