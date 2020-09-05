// Set up connection to mysql server
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Scorpi0ns!",
  database: "burger_db"
});

// Make connection
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected using id " + connection.threadId);
});

// Export connection for ORM to use
module.exports = connection;