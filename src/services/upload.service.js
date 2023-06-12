const tableName = "images";
const db = require("../models/connectDb");
const constantNotify = require("../Utils/contanst");
const fs = require("fs");

// Upload
exports.upload = async (data, result) => {
  try {
    const query = `INSERT INTO ${tableName} SET file_src = ?`;
    db.query(query, [data], (err, dataRes) => {
      if (err) {
        return result({ msg: constantNotify.ERROR }, null);
      }

      result(null, dataRes.insertId);
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};

// getByID
exports.getById = async (id, result) => {
  try {
    const query = `SELECT file_src FROM images WHERE id = ?;`;
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

// Delete Image
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

// getAll
exports.getAll = async (limit, result) => {
  try {
    const query = `SELECT * FROM ${tableName} LIMIT 2,${limit}`;
    db.query(query, (err, dataRes) => {
      if (err) {
        return result({ msg: constantNotify.ERROR }, null);
      }
      result(null, dataRes);
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};

// Update
exports.update = async (id, data, result) => {
  try {
    const query = `UPDATE ${tableName} SET file_src = ? WHERE id = ?`;
    db.query(query, [data.file_src, id], (err, dataRes) => {
      if (err) {
        result({ msg: constantNotify.UPDATE_DATA_FAILED }, null);
      }
      if (dataRes.affectedRows === 0) {
        return result({ msg: `Hình ảnh ${constantNotify.NOT_EXITS}` }, null);
      }

      result(null, dataRes);
    });
  } catch (error) {
    result({ msg: error }, null);
  }
};
