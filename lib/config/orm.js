// Get mysql connection
const conection = require("./connection");
const util = require("util");
const connection = require("./connection");

// Text fields
const textFields = ["burger_name", "user_name", "user_display", "user_hash"];

// Promisfy connection.query
const queryDB = function(arg_query, arg_values){ 
    return new Promise((arg_resolve, arg_reject) => {
        connection.query(arg_query, arg_values, (arg_error, arg_response) => {
            if(arg_error){
                arg_reject(arg_error.sql + "\n" + arg_error.stack + "\n" + arg_error.sqlMessage);
            }

            arg_resolve(arg_response);
        });
    })
};

// Object whose properties are functions implementing CRUD methods
const orm = {
    create: async function(arg_table, arg_fields, arg_values){
        // Append fields to query
        let t_query = `INSERT INTO ${arg_table}(${arg_fields.join(", ")}) VALUES ?;`;
        let t_values = [];

        // Throw error if there are not the same number of values as there are fields
        for(let i = 0; i < arg_values.length; i++){
            if(arg_fields.length != arg_values[i].length){
                throw new Error("ORM: Fields and values passed to orm.create do not have the same length");
            }
        }

        // For each row
        for(let i = 0; i < arg_values.length; i++){
            t_values.push([arg_values[i]]);
        }

        // Query database
        await queryDB(t_query, t_values);
    },
    read: async function(arg_table, arg_fields, arg_conditions, arg_sort){
        // Setup the query string
        let t_query = `SELECT ${arg_fields.join(", ")} FROM ${arg_table}`;

        // If no conditions are passed
        if(arg_conditions != undefined && arg_conditions != null && arg_conditions.length > 0){
            let t_conditions = [];

            for(let i = 0; i < arg_conditions.length; i++){
                t_conditions.push(arg_conditions[i].getString());
            }

            t_query += " WHERE " + t_conditions.join(" AND ");
        }
        
        // If no sort criteria is passed
        if(arg_sort != undefined && arg_sort != null && arg_sort != {}){
            t_query += "ORDER BY " + arg_sort.getString();
        }

        // Query the database
        return await queryDB(t_query);
    },
    update: async function(arg_table, arg_fields, arg_values, arg_conditions){
        let t_query = `UPDATE ${arg_table} SET `;

        // Throw an error if the length of the fields and values
        if(arg_fields.length != arg_values.length){
            throw new Error("ORM: fields and values sent to orm.update do not have the same length");
        }

        // For each field, append SET statement
        let t_array = [];
        for(let i = 0; i < arg_fields.length; i++){
            t_array.push(arg_fields[i] + " = " + (textFields.includes(arg_fields[i]) ? ("\"" + arg_values[i] + "\"" )  : arg_values[i]));
        }
        t_query += t_array.join(", ");

        // Append condiitons to query
        t_query += " WHERE ";
        for(let i = 0; i < arg_conditions.length; i++){
            t_query += arg_conditions[i].getString();

            if(i != arg_conditions.length - 1){
                t_query += ", ";
            }
        }

        // Query database
        await queryDB(t_query);
    },
    delete: async function(arg_table, arg_ids){
        let t_query = `DELETE FROM ${arg_table} WHERE id IN (?);`

        await queryDB(t_query, [arg_ids]);
    },
    query: queryDB
}

class queryCondition{
    constructor(arg_field, arg_operation, arg_value){
        this.operations = ["=","!=","IN","REGEX"];
        this.field = arg_field;
        this.value = arg_value;

        if(this.operations.includes(arg_operation)){
            this.operation = arg_operation;
        }
        else{
            throw new Error("ORM: Class constructor for queryCondition was passed an invalid operation");
        }
    }

    getString(){
        return this.field + " " + this.operation + " " + (textFields.includes(this.field) ? "\"" + this.value + "\"" : this.value);
    }
}

class querySort{
    constructor(arg_field, arg_direction){
        this.directions = ["ASC", "DESC"];
        this.field = arg_field;

        if(this.directions.includes(arg_direction)){
            this.direction = arg_direction;
        }
        else{
            throw new Error("ORM: Class constructor for querySort was passed an invalid direction");
        }
    }

    getString(){
        return this.field + " " + this.directoin;
    }
}

// Testing calls to orm methods
orm.update("user_table",["user_name", "user_display"],["John", "Smith"], [new queryCondition("id", "=", 1)]);

module.exports = orm, queryCondition, querySort;