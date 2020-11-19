// Set up connection to mysql server
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: process.env.HOST,
  port: 3306,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB
});

// Export connection for ORM to use
module.exports = connection;