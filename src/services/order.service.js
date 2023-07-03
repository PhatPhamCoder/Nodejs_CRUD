const tablePayment = "tbl_payment";
const tableUser = "tbl_admin";
const tableOrder = "tbl_order";
const tableOrderProduct = "tbl_order_product";
const tableItem = "tbl_items";

const constantNotify = require("../Utils/contanst");
const db = require("../models/connectDb");

exports.createOrder = async (data, result) => {
  try {
    const query = `INSERT INTO ${tableOrder} SET ?`;
    db.query(query, data, (err, dataRes) => {
      if (err) {
        console.error(err);
        return result({ msg: constantNotify.ERROR }, null);
      }
      result(null, dataRes.insertId);
    });
  } catch (error) {
    return result({ msg: error }, null);
  }
};
