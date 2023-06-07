const db = require("../models/connectDb");
const tableName = "tbl_admin";
const constantNotify = require("../Utils/contanst");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwts = require("../helper/auth.helper");

// Register
exports.register = async (data, result) => {
  try {
    const dataInsert = `INSERT INTO ${tableName} SET ?`;
    db.query(dataInsert, data, async (err, dataRes__) => {
      if (err) {
        // console.log(err);
        return result({ msg: constantNotify.ERROR }, null);
      }
      result(null, dataRes__.insertId);
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};

// Login
exports.login = async (account, password, result) => {
  // console.log(account, password);
  try {
    db.getConnection((err, conn) => {
      if (err) {
        return result({ msg: err }, null);
      }
      conn.query(
        `SELECT id,active,password FROM ${tableName} WHERE account = ?`,
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
            // console.log(dataRes[0].password);

            const passwordCompare = await bcrypt.compare(
              password,
              dataRes[0].password,
            );
            if (!passwordCompare) {
              return result(
                {
                  param: "password",
                  msg: constantNotify.PASS_FAILD,
                },
                null,
              );
            }
            // console.log(dataRes[0].id);
            const _token = await jwts.make(dataRes[0].id);
            const _refreshToken = await jwts.refreshToken(dataRes[0].id);

            const updateToken = `UPDATE ${tableName} SET refresh_token = ? WHERE id = ?`;

            conn.query(
              updateToken,
              [_refreshToken, dataRes[0].id],
              (err, dataRes_) => {
                console.log(dataRes_);
                if (err) {
                  return result({ msg: constantNotify.ERROR }, null);
                }
              },
            );
            // tKVZ8YNYtqzeQeBTKQ
            result(null, {
              id: dataRes[0].id,
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
