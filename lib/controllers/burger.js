/** @module Routers/Burger */

// Dependencies
const express = require("express");
const {orm, queryCondition} = require("../config/orm");

/**
 * Router for login and register requests
 * 
 * @type {Router}
 * @const
 * @namespace burgerRouter
 */
const burgerRouter = express.Router();

/**
 * Returns all burgers under the user's burger table
 * 
 * @name /api-burger/get/all
 * @function 
 * @memberof module:Routers/Burger~burgerRouter
 * @inner
 * @returns {Array.<Object>}
 */
burgerRouter.get("/api-burger/get/all", function(arg_request, arg_response, next){
    orm.read(`burger_table_${2}`, ["*"]).then( arg_data => arg_response.status(200).json(arg_data));
});

/**
 * Returns a burger from the user's burger table
 * 
 * @name /api-burger/get/:id
 * @function 
 * @memberof module:Routers/Burger~burgerRouter
 * @inner
 * @param {Number} id Id of the burger in the user's burger table
 * @returns {Object}
 */
burgerRouter.get("/api-burger/get/:id", function(arg_request, arg_response, next){
    orm.read(`burger_table_${arg_request.session.data.id}`,["*"], [new queryCondition("id", "=", arg_request.params.id)]).then(arg_data => {
        let t_data = arg_data[0];

        t_data["ingredients"] = decodeIngredients(arg_data[0].ingredients);

        arg_response.status(200).json(arg_data);
    });
});

/**
 * Adds a burger to the user's burger table
 * 
 * @name /api-burger/post
 * @function 
 * @memberof module:Routers/Burger~burgerRouter
 * @inner
 * @param {String} burgerName Name of the burger entry
 * @param {Array.<String>} ingredients Oredered list of ingredients on the burger
 */
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

/**
 * Updates a burger in the user's burger table
 * 
 * @name /api-burger/update/:id
 * @function 
 * @memberof module:Routers/Burger~burgerRouter
 * @inner
 * @param {Number} id Burger id to update
 * @param {String} burgerName Name of the burger entry
 * @param {Array.<String>} ingredients Oredered list of ingredients on the burger
 */
burgerRouter.post("/api-burger/update/:id", function(arg_request, arg_response, next){
    // If request body doesn't have proper field
    if(!arg_request.body.burgerName || !arg_request.body.ingredients){
        arg_response.sendStatus(422);
        return;
    }

    // Hash the ingredient array
    let t_hash = hashIngredients(arg_request.body.ingredients);

    // Update db entry
    orm.update(`burger_table_${arg_request.session.data.id}`, ["burger_name", "ingredients"],[arg_request.body.burgerName, t_hash],[new queryCondition("id","=",arg_request.params.id)]);
});

/**
 * Deletes a burger from the database
 * 
 * @name /api-burger/delete/:id
 * @function 
 * @memberof module:Routers/Burger~burgerRouter
 * @inner
 * @param {Number} id Name of the burger entry
 * @todo Implement
 */
burgerRouter.delete("/api-burger/delete/:id", function(arg_request, arg_response, next){
    
});

/**
 * @function hashIngredients
 * @param {Array<String>} arg_ingredients An array of strings representing burger ingredients
 * @description Translates an array of ingredient strings into a binary bit flag. 
 * @returns {Number}
 */
function hashIngredients(arg_ingredients){
    let t_number = 0;

    // For each ingredient
    for(let t_value of arg_ingredients){

        // Translate ingredient to hex bit
        switch(t_value){
            case "Plain":
                t_number += 1 << 0;
                break;
            case "Sesame":
                t_number += 1 << 1;
                break;
            case "Pumpernickel":
                t_number += 1 << 2;
                break;
            case "Single":
                t_number += 1 << 3;
                break;
            case "Double":
                t_number += 1 << 4;
                break;
            case "Triple":
                t_number += 1 << 5;
                break;
            case "Cheese":
                t_number += 1 << 6;
                break;
            case "Lettuce":
                t_number += 1 << 7;
                break;
            case "Tomato":
                t_number += 1 << 8;
                break;
            case "Onions":
                t_number += 1 << 9;
                break;
            case "Bacon":
                t_number += 1 << 10;
                break;
            case "Egg":
                t_number += 1 << 11;
                break;
            case "Pickles":
                t_number += 1 << 12;
                break;
            case "Ketchup":
                t_number += 1 << 13;
                break;
            case "Mustard":
                t_number += 1 << 14;
                break;
        }
    }

    return t_number;
}

/**
 * Converts ingredient hashes to array of strings
 * 
 * @param {Number} arg_number Number representing a binary flag
 * 
 * @returns {Array.<String>} 
 */
function decodeIngredients(arg_number){
    let return_ingredients = [];

    // Test for bit flags
    if((arg_number & (1 << 0)) != 0){
        return_ingredients.push( "Plain");
    }
    if((arg_number & (1 << 1)) != 0){
        return_ingredients.push( "Sesame");
    }
    if((arg_number & (1 << 2)) != 0){
        return_ingredients.push("Pumpernickel");
    }
    if((arg_number & (1 << 3)) != 0){
        return_ingredients.push("Single");
    }
    if((arg_number & (1 << 4)) != 0){
        return_ingredients.push("Double");
    }
    if((arg_number & (1 << 5)) != 0){
        return_ingredients.push("Triple");
    }
    if((arg_number & (1 << 6)) != 0){
        return_ingredients.push("Cheese");
    }
    if((arg_number & (1 << 7)) != 0){
        return_ingredients.push("Lettuce");
    }
    if((arg_number & (1 << 8)) != 0){
        return_ingredients.push("Tomato");
    }
    if((arg_number & (1 << 9)) != 0){
        return_ingredients.push("Onions");
    }
    if((arg_number & (1 << 10)) != 0){
        return_ingredients.push("Bacon");
    }
    if((arg_number & (1 << 11)) != 0){
        return_ingredients.push("Egg");
    }
    if((arg_number & (1 << 12)) != 0){
        return_ingredients.push("Pickles");
    }
    if((arg_number & (1 << 13)) != 0){
        return_ingredients.push("Ketchup");
    }
    if((arg_number & (1 << 14)) != 0){
        return_ingredients.push("Mustard");
    }

    return return_ingredients;
}

module.exports = burgerRouter;