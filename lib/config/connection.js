// Set up connection to mysql server
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT || 3306,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB
});

// Make connection
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.message + "," + err.sqlMessage + "\n" +err.stack);
    return;
  }
  console.log("connected using id " + connection.threadId);
})

// Export connection for ORM to use
module.exports = connection;