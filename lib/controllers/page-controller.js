// Dependencies
const express = require("express");
const expHB = require("express-handlebars");
const passport = require("passport");
const { orm } = require("../config/orm");

// Create router
const pageController = express.Router();

// ROUTE -- Render login page
pageController.get("/", renderLoginPage);
pageController.get("/login", renderLoginPage);

// ROUTE -- Render registration page
pageController.get("/register", function(arg_request, arg_response, next){
    arg_response.render("register");
});

// ROUTE -- Render user's burger page
pageController.get("/burger", function(arg_request, arg_response, next){
    // If session does not have a valid id
    if(!arg_request.session || !arg_request.session.data || !arg_request.session.data.id || arg_request.session.data.id === 0){
        arg_response.redirect("/");
    }

    // Store user Id
    let t_id = arg_request.session.data.id;

    // Else get some burgers in here
    orm.read(`burger_table_${t_id}`, ["*"], new queryCondition("id", "=", t_id)).then(arg_data => {
        arg_response.json(arg_data);
    });
});


function renderLoginPage(arg_request, arg_response, next) {
    arg_request.session.data = {
        id: 0
    }
    arg_response.render("login");
}



module.exports = pageController;


