const db = require("../models/connectDb");
const tableName = "tbl_admin";
const constantNotify = require("../Utils/contanst");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { signAccesToken, signRefreshToken } = require("../middlewares/init_jwt");
const { networkInterfaces } = require("os");
const sendEmail = require("../controllers/email.controller");

// Register
exports.register = async (data, result) => {
  try {
    const dataInsert = `INSERT INTO ${tableName} SET ?`;
    db.query(dataInsert, data, async (err, dataRes__) => {
      if (err) {
        return result({ msg: constantNotify.ERROR }, null);
      }
      result(null, dataRes__.insertId);
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};

// verifyOTP
exports.verifyOTP = async (data, result) => {
  try {
    const compareOTP = await bcrypt.compare(data?.otp, data?.OTP);
    if (!compareOTP) {
      const nets = networkInterfaces();
      const results = {};

      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
          if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
              results[name] = [];
            }
            results[name].push(net.address);
          }
        }
      }

      const dataSendEmail = {
        to: data?.email,
        text: "Hey user",
        subject: "[OPTECH] CẢNH BÁO BẢO MẬT",
        html: `Hi bạn,
            Chúng tôi nghi ngờ tài khoản của bạn đang cố bị xâm nhập tại địa chỉ IP: ${
              results["Wi-Fi"][0] || results["Ethernet"][0]
            }
            Bạn vui lòng liên hệ đội ngũ Admin để bảo vệ tài khoản!
            `,
      };

      await sendEmail(dataSendEmail);
      db.query(`UPDATE ${tableName} SET OTP = 0, active = 0`);
      return result({ msg: `OTP ${constantNotify.IS_WRONG}` }, null);
    }
    const query = `UPDATE ${tableName} SET OTP = 0, active = 1`;
    db.query(query, (err, data) => {
      if (err) {
        return result({ msg: constantNotify.ERROR }, null);
      }
      if (data.affectedRows === 0) {
        return result({ msg: `ID ${constantNotify.NOT_EXITS}` }, null);
      }

      result(null, data.insertId);
    });
  } catch (error) {
    return result({ msg: error }, null);
  }
};

// Login
exports.login = async (account, password, result) => {
  try {
    db.getConnection((err, conn) => {
      if (err) {
        return result({ msg: err }, null);
      }
      // check id, active and password
      conn.query(
        `SELECT id,role_id,name,active,password,email FROM ${tableName} WHERE account = ?`,
        account,
        async (err, dataRes) => {
          try {
            if (err) {
              return result({
                param: account,
                msg: constantNotify.ACCOUNT_NOTFOUND,
              });
            }
            if (dataRes[0].active !== 1) {
              return result({
                param: "active",
                msg: constantNotify.ACTIVE_FAILD,
              });
            }
            // console.log(dataRes);

            const passwordCompare = await bcrypt.compare(
              password,
              dataRes[0].password,
            );

            if (!passwordCompare) {
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
                to: dataRes[0].email,
                text: "Hey user",
                subject: "[OPTECH] CẢNH BÁO BẢO MẬT",
                html: `Hi bạn,
                  Chúng tôi nghi ngờ tài khoản của bạn đang cố bị xâm nhập tại địa chỉ IP: ${
                    results["Wi-Fi"][0] || results["Ethernet"][0]
                  }
                  Bạn vui lòng đăng nhập hệ thống đổi mật khẩu để bảo vệ tài khoản!
                `,
              };

              await sendEmail(dataSendEmail);
              db.query(`UPDATE ${tableName} SET OTP = 0, active = 0`);
              return result(
                {
                  param: "password",
                  msg: constantNotify.PASS_FAILD,
                },
                null,
              );
            }

            const data = {
              userId: dataRes[0].id,
              name: dataRes[0].name,
              role_id: dataRes[0].role_id,
            };

            /**Create AccessToken and RefreshToken */
            const _token = await signAccesToken(data);
            const _refreshToken = await signRefreshToken(data);
            // console.log(_token);

            /**update RefreshToken at DB */
            const updateToken = `UPDATE ${tableName} SET refresh_token = ? WHERE id = ?`;
            conn.query(
              updateToken,
              [_refreshToken, dataRes[0].id],
              (err, dataRes_) => {
                if (err) {
                  return result({ msg: constantNotify.ERROR }, null);
                }
              },
            );
            result(null, {
              userId: dataRes[0].id,
              accessToken: _token,
              refreshToken: _refreshToken,
            });
          } catch (error) {
            result({ msg: error }, null);
          }
        },
      );
      conn.release();
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};

// GetAll
exports.getall = async (offser, limit, result) => {
  try {
    let dataQuery = `SELECT * FROM tbl_admin LIMIT ${offser},${limit}`;
    db.query(dataQuery, (err, dataRes) => {
      // console.log(query);
      if (err) {
        // console.log(err);
        return result({ msg: constantNotify.ERROR }, null);
      }
      // console.log(dataRes);
      result(null, dataRes);
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};

// GetById
exports.getById = async (id, result) => {
  try {
    const query = `SELECT * FROM ${tableName} WHERE ${tableName}.id = ?`;
    db.query(query, id, (err, dataRes) => {
      if (err) {
        return result({ msg: constantNotify.ERROR }, null);
      }

      result(null, dataRes);
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};

// Delete
exports.delete = async (id, result) => {
  try {
    const query = `DELETE FROM ${tableName} WHERE ${tableName}.id = ?`;
    db.query(query, id, (err, dataRes) => {
      if (err) {
        return result({ msg: constantNotify.ERROR }, null);
      }

      if (dataRes.affectedRows === 0) {
        return result({ msg: `ID ${constantNotify.NOT_EXITS}` });
      }
      result(null, dataRes);
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};

// Update
exports.update = async (id, data, result) => {
  // console.log("check data from service::", data);
  try {
    const query = `UPDATE ${tableName} SET name=?,role_id=?,email=?,account=?,active =?,updated_at=? WHERE id =?`;
    // console.log("check data from service::", dataRes);
    db.query(
      query,
      [
        data.name,
        data.role_id,
        data.email,
        data.account,
        data.active,
        data.updated_at,
        id,
      ],
      (err, dataRes) => {
        if (err) {
          return result(
            {
              msg: constantNotify.ERROR,
            },
            null,
          );
        }

        // if (dataRes.affectedRows === 0) {
        //   return result({ msg: `ID ${constantNotify.NOT_EXITS}` }, null);
        // }

        result(null, dataRes.insertId);
      },
    );
  } catch (error) {
    result({ msg: error }, null);
  }
};

// refreshToken
exports.refreshToken = async (userId, resfreshToken, result) => {
  try {
    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }
      const query = `SELECT * FROM tbl_admin WHERE refresh_token LIKE "%${resfreshToken}%" AND id = ${userId}`;
      conn.query(query, async (err, dataRes) => {
        if (err) {
          result({ msg: constantNotify.ERROR }, null);
          return;
        }
        // console.log(dataRes);
        if (dataRes.length === 0) {
          const query = `UPDATE ${tableName} SET refresh_token=0 WHERE id = ${userId}`;
          conn.query(query, async (err, dataRes_) => {
            if (err) {
              result({ msg: constantNotify.ERROR }, null);
              return;
            }
          });
        }
        if (dataRes.length > 0) {
          await jwt.sign(
            resfreshToken,
            constantNotify.REFRESH_TOKEN,
            async (err, dataVerify) => {
              if (err) {
                result({ msg: constantNotify.ERROR }, null);
                return;
              }
              // console.log(dataVerify);
              const accessToken = await jwt.sign(
                { userId },
                constantNotify.ACCESS_TOKEN,
                {
                  expiresIn: constantNotify.TOKEN_TIME_LIFE,
                },
              );

              const refreshToken = await jwt.sign(
                { userId },
                constantNotify.REFRESH_TOKEN,
                { expiresIn: constantNotify.REFRESH_TOKEN_TIME_LIFE },
              );

              const query = `UPDATE tbl_admin SET refresh_token=? WHERE id=?`;
              conn.query(query, [refreshToken, userId], (err, dataRes__) => {
                if (err) {
                  result({ msg: constantNotify.ERROR }, null);
                  return;
                }
              });
              result(null, { accessToken, refreshToken });
            },
          );
        }
      });
      conn.release();
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};
