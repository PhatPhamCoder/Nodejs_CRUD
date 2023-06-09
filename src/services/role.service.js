const tableName = "tbl_role";
const db = require("../models/connectDb");
const constantNotify = require("../Utils/contanst");

// Create
exports.create = async (data, result) => {
  try {
    const query = `INSERT INTO ${tableName} SET ?`;
    // console.log(data);
    db.query(query, data, (err, dataRes) => {
      if (err) {
        // console.log(err);
        return result(
          {
            msg: constantNotify.ADD_DATA_FAILED,
          },
          null,
        );
      }
      //   console.log("Check DataRes::", dataRes);
      result(null, dataRes.insertId);
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
exports.update = async (data, id, result) => {
  try {
    const query = `UPDATE ${tableName} SET name=?,publish=?,updated_at=? WHERE id = ?`;
    db.query(
      query,
      [data.name, data.publish, data.updated_at, id],
      (err, dataRes) => {
        if (err) {
          return result({ msg: constantNotify.ERROR }, null);
        }
        if (dataRes.affectedRows == 0) {
          return result({ msg: `ID ${constantNotify.ALREADY_EXIST}` });
        }
        result(null, dataRes.insertId);
      },
    );
  } catch (error) {
    result({ msg: error }, null);
  }
};
