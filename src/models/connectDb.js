const mysql = require("mysql2");
const dbconfig = require("../config/db.config");

const connection = mysql.createPool({
  host: dbconfig.HOST,
  user: dbconfig.USER,
  password: dbconfig.PASSWORD,
  database: dbconfig.DATABASE,
});

connection.getConnection(function (err, connection) {
  if (err) {
    throw err;
  }
  console.log("Database is Connected");
});

module.exports = connection;
