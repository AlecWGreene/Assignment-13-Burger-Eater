// Load modules
const express = require("express");
const sha256 = require("js-sha256");

const {orm: orm, queryCondition: queryCondition, querySort: querySort } = require("../config/orm");

// Setup router
const loginRouter = express.Router();

/**
 * @function hashPassword
 * @param {String} arg_string The string to hash
 * @description Uses SHA256 to hash the string
 * @returns {String}
 */
function hashPassword(arg_string){
    return sha256(arg_string);
}

/**
 * @function verifyLogin
 * @param {String} arg_userName username for the login attempt
 * @param {String} arg_hash hash to compare against the server
 * @description queries the database for user ids with matching usernames and password hashes
 * @returns {String}
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
 * @function userLogin
 * @param {String} arg_userName username of the user to login
 * @description Updates the database to log the user as logged in
 */
async function userLogin(arg_id){
    await orm.update("user_table",["logged_in"],[true],[new queryCondition("id","=",arg_id)]);
    console.log("User ", arg_id + " has logged in"); 
}



// MIDDLEWARE ROUTES
// ============================================================

// ROUTE -- Check Login info against database
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
            return;
        }

        // Write header
        arg_response.setHeader('Content-Type', 'text/html');

        // Send back the id
        userLogin(arg_id);
        arg_request.session.data.id = arg_id;

        arg_response.redirect("/burger");
    });
});

// ROUTE -- Adds data to the database
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
            }).catch(arg_error => console.log(arg_error));  
        }
        else{
            arg_response.sendStatus(409);
        }
    });
});

module.exports = loginRouter;