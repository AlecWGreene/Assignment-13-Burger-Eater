// Dependencies
const express = require("express");
const expHB = require("express-handlebars");
const passport = require("passport");

// Create router
const pageController = express.Router();

// ROUTE -- Render login page
pageController.get("/", function(arg_request, arg_response, next){
    arg_response.render("login");
});
pageController.get("/login", function(arg_request, arg_response, next){
    arg_response.render("login");
});

// ROUTE -- Render registration page
pageController.get("/register", function(arg_request, arg_response, next){
    arg_response.render("register");
});

// ROUTE -- Render user's burger page
pageController.get("/burger", function(arg_request, arg_response, next){
    arg_response.send();
});



module.exports = pageController;