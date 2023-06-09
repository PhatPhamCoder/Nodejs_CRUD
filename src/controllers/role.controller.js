const { validationResult } = require("express-validator");
const db = require("../models/connectDb");
const constantNotify = require("../Utils/contanst");
const Role = require("../models/role.model");
const roleService = require("../services/role.service");
const tableName = "tbl_role";

// create
exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({
        result: false,
        errors: errors.array(),
      });
    }

    const { name, publish } = req.body;

    db.query(
      `SELECT name FROM ${tableName} WHERE name = ?`,
      name,
      (err, dataRes) => {
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
                param: "name",
                msg: `Nhóm quyền ${constantNotify.ALREADY_EXIST}`,
              },
            ],
          });
        }

        // Data insert
        const role = new Role({
          name: name,
          publish: !publish ? 0 : 1,
          created_at: Date.now(),
        });
        delete role.updated_at;
        // console.log("check role::", role);
        roleService.create(role, (err, res_) => {
          //   console.log("check res_::", res_);
          if (err) {
            return res.send({
              result: false,
              error: err,
            });
          }
          role.id = res_;
          role.updated_at = 0;
          res.send({
            result: true,
            data: {
              msg: constantNotify.ADD_DATA_SUCCESS,
              insertId: res_,
              newData: role,
            },
          });
        });
      },
    );
  } catch (error) {
    res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};

// getByID
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    roleService.getById(id, (err, res_) => {
      if (err) {
        return res.send({
          result: false,
          error: err,
        });
      }
      res.send({
        result: true,
        data: res_,
      });
    });
  } catch (error) {
    res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};

// Delete
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    roleService.delete(id, (err, res_) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }
      res.send({
        result: true,
        data: {
          msg: constantNotify.DELETE_DATA_SUCCESS,
        },
      });
    });
  } catch (error) {
    res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};

// Update
exports.update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({
        result: false,
        error: errors.array(),
      });
    }
    const id = req.params.id;
    const { name, publish } = req.body;

    db.getConnection((err, conn) => {
      if (err) {
        return res.send({
          result: false,
          error: [{ msg: constantNotify.ERROR }],
        });
      }

      conn.query(
        `SELECT name FROM ${tableName} WHERE name = ?`,
        name,
        (err, dataRes) => {
          if (err) {
            return res.send({
              result: false,
              error: [{ msg: constantNotify.ERROR }],
            });
          }

          if (dataRes.length !== 0) {
            return res.send({
              result: false,
              error: [
                {
                  param: "name",
                  msg: `Name ${constantNotify.ALREADY_EXIST}`,
                },
              ],
            });
          }

          const role = new Role({
            name: name,
            publish: !publish ? false : true,
            updated_at: Date.now(),
          });
          // console.log("check Role::",role);
          delete role.created_at;

          roleService.update(role, id, (err, res_) => {
            if (err) {
              return res.send({
                result: false,
                error: [{ msg: constantNotify.ERROR }],
              });
            }

            role.id = id;
            res.send({
              result: true,
              data: {
                msg: constantNotify.UPDATE_DATA_SUCCESS,
                id,
                newDate: role,
              },
            });
          });
          conn.release();
        },
      );
    });
  } catch (error) {
    res.send({
      result: false,
      error: [{ msg: error }],
    });
  }
};
