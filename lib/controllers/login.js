/** @module Routers/Login */

// Load modules
const express = require("express");
const sha256 = require("js-sha256");

const {orm: orm, queryCondition: queryCondition, querySort: querySort } = require("../config/orm");

/**
 * Router for login and register requests
 * 
 * @type {Router}
 * @const
 * @namespace loginRouter
 */
const loginRouter = express.Router();

/**
 * Uses SHA256 to hash the string
 * 
 * @param {String} arg_string The string to hash
 * @returns {String}
 */
function hashPassword(arg_string){
    return sha256(arg_string);
}

/**
 * Queries the database for user ids with matching usernames and password hashes, return the id that does so or 0 if no matches are found.
 * 
 * @async
 * @param {String} arg_userName username for the login attempt
 * @param {String} arg_hash hash to compare against the server
 * @returns {Number}
 */
async function verifyLogin(arg_userName, arg_hash){
    // Query database
    let t_data = await orm.read("user_table", ["id"], [new queryCondition("user_name","=",arg_userName), new queryCondition("user_hash", "=", arg_hash)]);

    // Return the first id received, and 0 if no ids are found
    if(t_data.length === 0){
        return 0;
    }  
    else{
        return t_data[0].id;
    }
}

/**
 * Updates the database to log the user as logged in
 * 
 * @async
 * @param {String} arg_userName username of the user to login
 */
async function userLogin(arg_id){
    await orm.update("user_table",["logged_in"],[true],[new queryCondition("id","=",arg_id)]);
    console.log("User ", arg_id + " has logged in"); 
}



// MIDDLEWARE ROUTES
// ============================================================

/**
 * Takes in username and password and returns the userId if the login is successful
 * 
 * @name /api-login/login/
 * @function 
 * @memberof module:Routers/Login~loginRouter
 * @inner
 * @param {String} username Username of the login attempt
 * @param {String} password Plaintext password
 * @returns {Number}
 */
loginRouter.post("/api-login/login/", function(arg_request, arg_response, next){

    // If params are empty
    if(arg_request.body.username === undefined || arg_request.body.username.trim() === ""
    || arg_request.body.password === undefined || arg_request.body.password.trim() === ""){
        arg_response.sendStatus(409);
        return;
    }

    // Reject request if user has no session data
    if(!arg_request.session.data){
        arg_response.session.data = { id: 0 }
        return;
    }

    // Hash the password
    let t_hash = hashPassword(arg_request.body.password);
    console.log("Login attempted ", arg_request.body);
    // Query database to verify login info
    verifyLogin(arg_request.body.username, t_hash).then(function(arg_id){
        // If login failed, 
        if(arg_id === 0){
            return arg_response.status("401");
        }

        // Write header
        arg_response.setHeader('Content-Type', 'text/html');

        // Send back the id
        userLogin(arg_id);
        arg_request.session.data.id = arg_id;

        arg_response.redirect("/burger");
    });
});

/**
 * Takes in username and password and returns the userId if the login is successful
 * 
 * @name /api-login/register/
 * @function 
 * @memberof module:Routers/Login~loginRouter
 * @inner
 * @param {String} username Username of the login attempt
 * @param {String} display String to display to user and others 
 * @param {String} password Plaintext password
 * @returns {Number}
 */
loginRouter.post("/api-login/register/", function(arg_request, arg_response, next){

    // If params are empty
    if(arg_request.body.username === undefined || arg_request.body.username.trim() === ""
    || arg_request.body.password === undefined || arg_request.body.password.trim() === ""
    || arg_request.body.display === undefined || arg_request.body.display.trim() === ""){
        arg_response.sendStatus(409);
        return;
    }

    // Reject request if user has no session data
    if(!arg_request.session.data){
        arg_response.sendStatus(401);
        return;
    }

    // Send error if username exists
    orm.read("user_table",["COUNT(*)"], [new queryCondition("user_name","=",arg_request.body.username)]).then( arg_data => {
        if(arg_data[0]["COUNT(*)"] === 0){
            // Hash the password
            let t_hash = hashPassword(arg_request.body.password);
            
            // Insert row into user table and create their burger table
            orm.create("user_table",["user_name", "user_display", "user_hash"], [[arg_request.body.username, arg_request.body.display, t_hash]]).then(arg_response2 => {
                console.log("User " + arg_request.body.username + " was created");
                orm.call("create_table",[arg_response2.insertId]).then(arg_response3 => {
                    arg_request.session.data["tableName"] = `burger_table_${arg_response2.insertId}`;
                    arg_response.redirect("/");
                });
            }).catch(arg_error => console.log(arg_error.message));  
        }
        else{
            arg_response.sendStatus(409);
        }
    });
});

module.exports = loginRouter;