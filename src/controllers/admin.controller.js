const { validationResult } = require("express-validator");
const db = require("../models/connectDb");
const regex = require("../Utils/regex");
const constantNotify = require("../Utils/contanst");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin.model");
const adminService = require("../services/admin.service");
const tableName = "tbl_admin";

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
        console.log("Connect to DB is Failed");
        return;
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

              // Data insert
              const admin = new Admin({
                name: name,
                role_id: role_id,
                password: hashPassword,
                email: email,
                account: account,
                type: 0,
                refresh_token: 0,
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
                    `SELECT name FROM tbl_role WHERE id = ? `,
                    role_id,
                    (err, dataRes__) => {
                      if (err) {
                        return res.send({
                          result: false,
                          error: [{ msg: constantNotify.ERROR }],
                        });
                      }
                      admin.id = res_;
                      admin.name_role = dataRes__[0]?.name;
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
      conn.release();
    });
  } catch (error) {
    res.send({
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
};

// Get All
exports.getall = async (req, res) => {
  try {
    const dataSearch = req.query;
    let offset = 0;
    let limit = 10;
    if (dataSearch.offset) {
      offset = dataSearch.offset;
    }
    if (dataSearch.limit) {
      limit = dataSearch.limit;
    }
    adminService.getall(dataSearch, offset, limit, (err, res_) => {
      console.log(res_);
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }
      const totalPage = Math.ceil(res_[0]?.total / limit);

      res_.forEach((item) => {
        delete item.total;
      });

      res.send({
        result: true,
        totalPage: totalPage ? totalPage : 0,
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
      if (err) {
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
    }

    if (!regex.regexEmail.test(email)) {
      if (err) {
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
    }

    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          result: false,
          error: [{ msg: constantNotify.ERROR }],
        });
      }

      conn.query(
        `SELECT account,id FROM ${tableName} WHERE account = ?`,
        account,
        async (err, dataRes) => {
          if (err) {
            return res.send({
              result: false,
              error: [{ msg: constantNotify.ERROR }],
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

              if (dataRes_.length !== 0 && dataRes_[0]?.id !== parseInt(id)) {
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
      conn.release();
    });
  } catch (error) {
    res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};
