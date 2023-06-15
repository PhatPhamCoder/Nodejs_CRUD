const db = require("../models/connectDb");
const tableName = "tbl_admin";
const constantNotify = require("../Utils/contanst");
const bcrypt = require("bcrypt");
const jwts = require("../helper/auth.helper");
const jwt = require("jsonwebtoken");
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
      // check id, active and password
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

            /**Create AccessToken and RefreshToken */
            const _token = await jwts.make(dataRes[0].id);
            const _refreshToken = await jwts.refreshToken(dataRes[0].id);

            /**update RefreshToken at DB */
            const updateToken = `UPDATE ${tableName} SET refresh_token = ? WHERE id = ?`;
            conn.query(
              updateToken,
              [_refreshToken, dataRes[0].id],
              (err, dataRes_) => {
                // console.log(dataRes_);
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
