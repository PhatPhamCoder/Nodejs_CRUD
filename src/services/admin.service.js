const db = require("../models/connectDb");
const tableName = "tbl_admin";
const constantNotify = require("../Utils/contanst");

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
