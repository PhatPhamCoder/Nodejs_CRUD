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
exports.getall = async (dataSearch, offset, limit, result) => {
  try {
    // let keyword = "";
    // let role = "";
    // const innerJoin = `tbl_role INNER JOIN ${tableName} ON tbl_role.id = ${tableName}.role_id `;
    // const selectCount = `SELECT COUNT(*) FROM ${innerJoin}`;
    // const selectData = `${tableName}.id,${tableName}.name,tbl_role.name as name_role,${tableName}.account,${tableName}.email,${tableName}.active,${tableName}.created_at,${tableName}.updated_at`;
    // let where = "WHERE type = 0";
    // let query = `SELECT ${selectData},(${selectCount} ${where} ) as total FROM ${innerJoin} ${where} ORDER BY ${tableName}.id DESC LIMIT ${offset},${limit}`;
    let dataQuery = `SELECT * FROM tbl_admin`;

    // if (dataSearch.keyword && !dataSearch.role) {
    //   keyword = dataSearch.keyword;
    //   where = `WHERE ${tableName}.name LIKE "%${keyword}%" AND type = 0`;

    //   query = `SELECT ${selectData},(${selectCount} ${where}) as total FROM ${innerJoin} ${where} ORDER BY ${tableName}.id DESC LIMIT ${offset},${limit}`;
    // }
    // if (!dataSearch.keyword && dataSearch.role) {
    //   role = dataSearch.role;
    //   where = `WHERE ${tableName}.role_id LIKE "%${role}%" AND type = 0`;
    //   query = `SELECT ${selectData},(${selectCount} ${where}) as total FROM ${innerJoin} ${where} ORDER BY ${tableName}.id DESC LIMIT ${offset},${limit}`;
    // }
    // if (dataSearch.keyword && dataSearch.role) {
    //   role = dataSearch.role;
    //   keyword = dataSearch.keyword;
    //   where = `WHERE ${tableName}.role_id LIKE "%${role}%" AND ${tableName}.name LIKE "%${keyword}%" AND type = 0`;
    //   query = `SELECT ${selectData},(${selectCount} ${where}) as total FROM ${innerJoin} ${where} ORDER BY ${tableName}.id DESC LIMIT ${offset},${limit}`;
    // }

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

// getById
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

        if (dataRes.affectedRows === 0) {
          return result({ msg: `ID ${constantNotify.NOT_EXITS}` }, null);
        }
        result(null, dataRes.insertId);
      },
    );
  } catch (error) {
    result({ msg: error }, null);
  }
};
