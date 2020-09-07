// Dependencies
require('dotenv').config();
const mysql = require("mysql");
const express = require("express");
const expHB = require("express-handlebars");
const fs = require("fs");
const util = require("util");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Setup passport
passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    }
  ));

// Load scripts
const loginRouter = require("./lib/controllers/login");
const pageController = require("./lib/controllers/page-controller");

// Initialize express 
const app = express();

// Configure express
const PORT = process.env.PORT || 8080;
app.use(express.static(__dirname + "/public/"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure handlebars 
app.engine("handlebars", expHB({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Setup routes
app.use(loginRouter);
app.use(pageController);

// Initialize application
app.listen(PORT, function() {
    console.log("Burger Eater now listening at localhost:" + PORT);
});