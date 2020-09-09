// Dependencies
const express = require("express");
const {orm, queryCondition} = require("../config/orm");

// Create router system
const burgerRouter = express.Router();

// ROUTE -- Get all burgers from the database
burgerRouter.get("/api-burger/get/all", function(arg_request, arg_response, next){
    orm.read(`burger_table_${2}`, ["*"]).then( arg_data => arg_response.status(200).json(arg_data));
});

// ROUTE -- Get a burger from the database
burgerRouter.get("/api-burger/get/:id", function(arg_request, arg_response, next){
    orm.read(`burger_table_${arg_request.session.data.id}`,["*"], [new queryCondition("id", "=", arg_request.params.id)]).then(arg_data => arg_response.status(200).json(arg_data));
});

// ROUTE -- Post a burger to the database
burgerRouter.post("/api-burger/post", function(arg_request, arg_response, next){
    // If request body doesn't have proper field
    if(!arg_request.body.burgerName || !arg_request.body.ingredients){
        arg_response.sendStatus(422);
        return;
    }

    // Hash the ingredient array
    let t_hash = hashIngredients(arg_request.body.ingredients);

    // Create new database entry
    orm.create(`burger_table_${arg_request.session.data.id}`, ["burger_name", "ingredients"], [[arg_request.body.burgerName, t_hash]]).then(arg_message => {
        console.log(arg_message);
        arg_response.sendStatus(201);
    });
});

// ROUTE -- Delete a burger from the database
burgerRouter.delete("/api-burger/delete/:id", function(arg_request, arg_response, next){
    
});

function hashIngredients(arg_ingredients){
    let t_number = "0";

    // For each ingredient
    for(let t_value of arg_ingredients){
        let t_digit = "0";

        // Translate ingredient to hex bit
        switch(t_value){
            case "Plain Bun":
                t_digit = "1";
                break;
            case "Sesame Bun":
                t_digit = "2";
                break;
            case "Pumpernickel":
                t_digit = "3";
                break;
            case "Single Patty":
                t_digit = "4";
                break;
            case "Double Patty":
                t_digit = "5";
                break;
            case "Triple Patty":
                t_digit = "6";
                break;
            case "Cheese":
                t_digit = "7";
                break;
            case "Lettuce":
                t_digit = "8";
                break;
            case "Tomato":
                t_digit = "9";
                break;
            case "Onions":
                t_digit = "a";
                break;
            case "Bacon":
                t_digit = "b";
                break;
            case "Egg":
                t_digit = "c";
                break;
            case "Pickles":
                t_digit = "d";
                break;
            case "Ketchup":
                t_digit = "e";
                break;
            case "Mustard":
                t_digit = "f";
                break;
        }

        // Convert number to string, append digit and convert back to number
        t_number += t_digit;
    }

    return Number("0x" + t_number);
}

module.exports = burgerRouter;