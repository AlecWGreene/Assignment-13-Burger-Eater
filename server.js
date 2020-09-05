// Dependencies
require('dotenv').config();
const mysql = require("mysql");
const express = require("express");
const expHB = require("express-handlebars");
const fs = require("fs");
const util = require("util");
const path = require("path");

// Load scripts
//const routes = require("");

// Initialize express 
const app = express();

// Configure express
const PORT = process.env.PORT || 8080;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(routes); // Normally after handlebars

// Configure handlebars 
app.engine("handlebars", expHB({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Initialize application
app.listen(PORT, function() {
    console.log("Burger Eater now listening at localhost:" + PORT);
});