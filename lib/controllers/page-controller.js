/** @module Routers/Page-Controller */

// Dependencies
const express = require("express");
const expHB = require("express-handlebars");
const passport = require("passport");
const { orm, queryCondition, querySort } = require("../config/orm");

/**
 * Express router for swapping the user between pages
 * 
 * @name pageController
 * @const 
 * @namespace pageController
 */
const pageController = express.Router();

/**
 * Render the login page
 * 
 * @name get/login
 * @memberof module:Routers/Page-Controller~pageController
 * @function
 * @inner
 */
pageController.get("/login", renderLoginPage);

/**
 * Render the registration page
 * 
 * @name get/register
 * @memberof module:Routers/Page-Controller~pageController
 * @function
 * @inner
 */
pageController.get("/register", function(arg_request, arg_response, next){
    arg_response.render("register");
});

/**
 * Render the burger page if the user is logged in, redirecting them to the login page if the user id is empty or 0
 * 
 * @name get/burger
 * @memberof module:Routers/Page-Controller~pageController
 * @function
 * @inner
 * @param {Number} sessionId Id from session.data.id representing the currently logged in user
 */
pageController.get("/burger", function(arg_request, arg_response, next){
    // If session does not have a valid id
    if(!arg_request.session || !arg_request.session.data || !arg_request.session.data.id || arg_request.session.data.id === 0){
        arg_response.redirect("/login");
        return;
    }

    // Data object to return
    let return_data = {}

    // Store user Id
    let t_id = arg_request.session.data.id;

    // Get the user's display name
    orm.read("user_table",["user_display"],[new queryCondition("id","=",t_id)]).then(arg_names => {
        return_data["displayName"] = arg_names[0]["user_display"].toString();
        console.log(arg_names);

        // Render page with the collected data
        arg_response.status(200).render("burger", {
            layout: "userPage",
            displayName: return_data["displayName"],
        });
    });
    
});

/**
 * Assembles the login page using handlebars and registers a cookie with userId = 0
 * 
 * @method
 * @memberof module:Routers/Page-Controller
 * @param {Request} arg_request API request object to attach the cookie to
 * @param {Response} arg_response API response object used to render the login page on the browser
 */
function renderLoginPage(arg_request, arg_response, next) {
    arg_request.session.data = {
        id: 0
    }
    console.log("Login page rendered, sessionId", arg_request.session.data);
    arg_response.render("login");
}

/**
 * Render the login page
 * 
 * @name get/login
 * @memberof module:Routers/Page-Controller~pageController
 * @function
 * @inner
 */
pageController.get("/*", (arg_request, arg_response) => {
    if(!arg_request.session || !arg_request.session.data || !arg_request.session.data.id || arg_request.session.data.id === 0){
        arg_response.redirect("/login");
        return;
    }
});

module.exports = pageController;


