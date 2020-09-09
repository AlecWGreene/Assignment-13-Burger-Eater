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

/**
 * @const orm 
 * @method create
 * @method read
 * @method update
 * @method delete 
 * @method call
 * @method query
 */
const orm = {
    /**
     * @async
     * @function create
     * @param {String} arg_table Name of the table to access
     * @param {Array<String>} arg_fields List of fields from the table
     * @param {Array<String | Number>} arg_values List of values to fill into the columns
     * @description Create rows inside the database
     * @returns {Object}
     */
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
        return await queryDB(t_query, t_values);
    },
     /**
     * @async
     * @function read
     * @param {String} arg_table Name of the table to access
     * @param {Array<String>} arg_fields List of fields from the table
     * @param {Array<queryCondition>} arg_conditions List of conditions to run against the database
     * @param {Array<querySort>} arg_sort List of columns and directions to sort the data by 
     * @description Return rows inside the database according to the passed criteria
     * @returns {Array<Object>}
     */
    read: async function(arg_table, arg_fields, arg_conditions, arg_sort){
        // Setup the query string
        let t_query = `SELECT ${arg_fields.join(", ")} FROM ${arg_table} `;

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
     /**
     * @async
     * @function update
     * @param {String} arg_table Name of the table to access
     * @param {Array<String>} arg_fields List of fields from the table
     * @param {Array<String | Number>} arg_values List of values to fill into the columns
     * @param {Array<queryCondition>} arg_conditions List of conditions to run against the database
     * @description Updates rows form the table based on the passed criteria
     */
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
     /**
     * @async
     * @function delete
     * @param {String} arg_table Name of the table to access
     * @param {Array<String>} arg_ids List of row ids 
     * @description Deletes rows from the table based on the passed ids
     * @returns {Object}
     */
    delete: async function(arg_table, arg_ids){
        let t_query = `DELETE FROM ${arg_table} WHERE id IN (?);`

        await queryDB(t_query, [arg_ids]);
    },
     /**
     * @async
     * @function call
     * @param {String} arg_procedure Name of the procedure to run
     * @param {Array<String | Number>} arg_paramas Array of values to pass to the procedure
     * @description Calls a procedure defined in the database
     * @returns {Object}
     */
    call: async function(arg_procedure, arg_params){
        return await queryDB(`CALL ${arg_procedure}(${arg_params.join(", ")})`);
    },
     /**
     * @async
     * @function query
     * @param {String} arg_query String representing a SQL query
     * @param {Array<Array<String | Number> | String | Number>} arg_values List of arrays of values to insert into the SQL string
     * @description Promisfied wrapper of connection.query
     * @returns {Object | Array<Object>}
     */
    query: queryDB
}

/**
 * @class 
 * @classdesc A condition to insert into a SQL query
 * @property {String} field String representing a column from a database 
 * @property {String} operation A string representing an operation included in {@link this.operations}
 * @property {Number | String} value Value to compare the column values against
 * @property {Array<String>} operations List of strings representing different logical operations used to filter database rows
 * @method {@link getString} Returns a string representing the SQL condition
 */
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

    /**
     * @method getString
     * @description Returns a string representing a clause to insert into the SQL query
     * @returns {String}
     */
    getString(){
        return this.field + " " + this.operation + " " + (textFields.includes(this.field) ? "\"" + this.value + "\"" : this.value);
    }
}

/**
 * @class
 * @classdesc A condition to help sort rows in the database
 * @property {String} directions Either ASC or DESC based on whether the column should be assorted ascending or descending
 * @property {String} field Column from the table to sort by
 * @method {@link getString} Returns a string representing the SQL condition
 */
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

    /**
     * @method getString
     * @description Returns a string representing a clause to insert into the SQL query
     * @returns {String}
     */
    getString(){
        return this.field + " " + this.directoin;
    }
}

/**
 * @exports {@link orm}
 * @exports {@link queryCondition}
 * @exports {@link querySort}
 */
module.exports = {
    orm: orm, 
    queryCondition: queryCondition,
    querySort: querySort
}