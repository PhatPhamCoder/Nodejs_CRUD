const constantNotify = require("../Utils/contanst");
const db = require("../models/connectDb");
const Order = require("../models/orderModel");
const Receipt = require("../models/receipt.model");
const orderService = require("../services/order.service");

const tablePayment = "tbl_payment";
const tableUser = "tbl_admin";
const tableReceipt = "tbl_receipt";
const tableOrder = "tbl_order";
const tableOrderProduct = "tbl_order_product";
const tableItem = "tbl_items";

exports.getById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.params.userid;
    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          resullt: false,
          error: [err],
        });
      }
      conn.query(
        `SELECT userId FROM ${tableOrder} WHERE userId = ?`,
        userId,
        (err, dataRes) => {
          if (err) {
            return res.send({
              resullt: false,
              error: [err],
            });
          }
          if (dataRes.length === 0) {
            return res.send({
              resullt: false,
              error: [{ ms: `Người dùng chưa có đơn hàng` }],
            });
          }
          if (dataRes.length !== 0) {
            conn.query(
              ` SELECT u.id, u.userId, i.*
                FROM ${tableOrder} u
                INNER JOIN ${tableOrderProduct} ui
                ON ui.orderId = u.id
                INNER JOIN ${tableItem} i
                ON i.id = ui.itemId
                WHERE u.id = ${orderId}`,
              (err, dataRes) => {
                if (err) {
                  return res.send({
                    resullt: false,
                    error: [err],
                  });
                }
                if (dataRes.length === 0) {
                  return res.send({
                    resullt: false,
                    error: [{ ms: `Đơn hàng ${constantNotify.NOT_EXITS}` }],
                  });
                }
                if (dataRes.length !== 0) {
                  return res.send({
                    resullt: true,
                    data: dataRes,
                  });
                }
              },
            );
          }
        },
      );
      db.releaseConnection(conn);
    });
  } catch (error) {
    return res.send({
      resullt: false,
      error: [{ msg: error }],
    });
  }
};

exports.payment = async (req, res) => {
  try {
    const id = req.params.id;
    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }
      conn.query(
        `SELECT * FROM ${tablePayment} WHERE id = ${id}`,
        (err, dataRes) => {
          if (err) {
            return res.send({
              result: false,
              error: [{ msg: constantNotify.ERROR }],
            });
          }

          if (dataRes.length === 0) {
            return res.send({
              result: false,
              error: [{ msg: `Phương thức ${constantNotify.NOT_EXITS}` }],
            });
          }
          if (dataRes.length !== 0) {
            return res.send({
              result: true,
              data: dataRes,
            });
          }
        },
      );
      db.releaseConnection(conn);
    });
  } catch (error) {
    return res.send({
      resullt: false,
      error: [{ msg: error }],
    });
  }
};

exports.createReceipt = async (req, res) => {
  try {
    const userId = req.params.id;
    const { info, orderItems, paymentId } = req.body;

    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          result: false,
          error: [{ msg: constantNotify.ERROR }],
        });
      }

      conn.query(
        `SELECT * FROM ${tableUser} WHERE id = ${userId}`,
        (err, dataRes) => {
          if (err) {
            return res.send({
              resullt: false,
              error: [err],
            });
          }
          if (dataRes.length === 0) {
            return res.send({
              resullt: false,
              error: [{ msg: `Người dùng ${constantNotify.NOT_EXITS}` }],
            });
          }
          if (dataRes.length !== 0) {
            const order = new Order({
              userId: userId,
              created_at: Date.now(),
            });

            orderService.createOrder(order, (err, res_) => {
              if (err) {
                return res.send({
                  result: false,
                  erro: [err],
                });
              }
              orderItems.map((order) => {
                conn.query(
                  `INSERT INTO ${tableOrderProduct} SET orderId = ${res_},itemId = ${order?.id}`,
                  (err, data) => {
                    if (err) {
                      return res.send({
                        result: false,
                        error: [err],
                      });
                    }
                  },
                );
              });
              const receipt = new Receipt({
                receiptCode: info?.receiptCode,
                userId: userId,
                paymentId: paymentId,
                totalPrice: info?.price,
                receiptName: info?.Name,
                description: info?.description,
                created_at: Date.now(),
              });
              delete receipt.updated_at;
              // console.log(receipt);
              conn.query(
                `INSERT INTO ${tableReceipt} SET ?`,
                receipt,
                (err, dataRes) => {
                  if (err) {
                    return res.send({
                      resullt: false,
                      error: [err],
                    });
                  }
                  return;
                },
              );
              return res.send({
                result: true,
                data: { msg: constantNotify.ADD_DATA_SUCCESS },
              });
            });
          }
        },
      );
      db.releaseConnection(conn);
    });
  } catch (error) {
    return res.send({
      resullt: false,
      error: [{ msg: error }],
    });
  }
};
