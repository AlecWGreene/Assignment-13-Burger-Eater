// Dependencies
require('dotenv').config();
const connection = require("./lib/config/connection.js");
const express = require("express");
const expHB = require("express-handlebars");
const session = require("express-session");

// Load scripts
const loginRouter = require("./lib/controllers/login");
const pageController = require("./lib/controllers/page-controller");
const burgerRouter = require('./lib/controllers/burger');

// Initialize express 
const app = express();

// Configure express
const PORT = process.env.PORT || 8080;
app.use(express.static(__dirname + "/public/"));
app.use(express.static("views/img"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure handlebars 
app.engine("handlebars", expHB({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Setup express sessions
const secret = "Brown Dogs";
app.use(session({ secret: secret, cookie: { maxAge: 2400000, sameSite: "lax" }}));

// Setup routes
app.use(pageController);
app.use(loginRouter);
app.use(burgerRouter);

// Make connection
connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.message + "," + err.sqlMessage + "\n" +err.stack);
      return;
    }
    console.log("connected to DB using id " + connection.threadId);

    // Initialize application
    app.listen(PORT, function() {
        console.log("Burger Eater now listening at localhost:" + PORT);
    });
  })