// Dependencies
require('dotenv').config();
const mysql = require("mysql");
const express = require("express");
const expHB = require("express-handlebars");
const fs = require("fs");
const util = require("util");
const path = require("path");
const session = require("express-session");

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

// Setup express sessions
const secret = "Brown Dogs";
app.use(session({ secret: secret, cookie: { maxAge: 240000 }}));

// Setup routes
app.use(loginRouter);
app.use(pageController);

// Initialize application
app.listen(PORT, function() {
    console.log("Burger Eater now listening at localhost:" + PORT);
});