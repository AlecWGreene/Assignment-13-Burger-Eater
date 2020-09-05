// Dependencies
const sha256 = require("sha256");
const express = require("express");
const {orm: orm, queryCondition: queryCondition, querySort: querySort} = require("../config/orm");

// Create router
const loginRouter = express.Router();

function verifyLogin(arg_userName, arg_hash){
    return new Promise((arg_resolve, arg_reject) => {
        orm.read("user_table", ["id"],[new queryCondition("user_name", "=", arg_userName), new queryCondition("user_hash","=",arg_hash)]).then((arg_error, arg_response) => {
           if(arg_error){
                arg_reject(arg_error);
           }

           arg_resolve(arg_response);
        });
    });
}

// Register verifyLogin as middleware
loginRouter.use(verifyLogin);

// Route to login
loginRouter.get("/login/:userName/:hash", (arg_request, arg_response, arg_next) => {
    // Verify the login attempt before calling next
    verifyLogin(arg_request.params.userName, arg_request.params.hash).then( arg_data => {
        arg_response.send(arg_data);
        arg_next();
    });
});

module.exports = loginRouter;