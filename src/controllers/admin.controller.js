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
