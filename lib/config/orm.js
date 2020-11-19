// Get mysql connection
const connection = require("./connection");

// Text fields
const textFields = ["burger_name", "user_name", "user_display", "user_hash"];

// Promisfy connection.query
const queryDB = function(arg_query, arg_values){ 
    return new Promise((arg_resolve, arg_reject) => {
        console.log("SQL connection: " + connection);
        connection.query(arg_query, arg_values, (arg_error, arg_response) => {
            if(arg_error){
                arg_reject(arg_error.sql + "\n" + arg_error.stack + "\n" + arg_error.sqlMessage);
            }

            arg_resolve(arg_response);
        });
    })
};

/**
 * Wrapper for CRUD methods to the database
 * 
 * @mixin
 */
const orm = {
    /**
     * Assembles a query to insert data into the database
     * 
     * @async
     * @param {String} arg_table Name of the table in the database
     * @param {Array.<String>} arg_fields List of column names from the table
     * @param {Array.<Array.<(Number|String)>>} arg_values A list of row values to insert into the table
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
     * Assembles a query to return data from the database
     * 
     * @async
     * @param {String} arg_table Name of the table in the database
     * @param {Array.<String>} arg_fields List of column names from the table
     * @param {Array.<queryCondition>} arg_conditions List of conditions to run against table columns
     * @param {Array.<querySort>} arg_sort List of sort criteria 
     * @param {Array.<Array.<Array.<(Number|String)>>>} arg_values A rank-3 tensor representing a list of parameters to insert into the query
     * @returns {Array.<Object>} 
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
        console.log(t_query);
        return await queryDB(t_query);
    },
    /**
     * Assemblies a query to update rows in the table
     * 
     * @async
     * @param {String} arg_table Name of a table from a database
     * @param {Array.<String>} arg_fields List of columns to update
     * @param {Array.<(Number|String)>} arg_values List of values to update rows to
     * @param {Array.<queryCondition>} arg_conditions List of criteria through which to select rows to update
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
     * Assemble a query to delete rows from the database
     * 
     * @async
     * @param {String} arg_table Name of table from the database
     * @param {Array.<Number>} arg_ids List of ids from the table to delete
     */
    delete: async function(arg_table, arg_ids){
        let t_query = `DELETE FROM ${arg_table} WHERE id IN (?);`

        await queryDB(t_query, [arg_ids]);
    },
    /**
     * Call a procedure defined within the SQL server 
     * 
     * @async
     * @param {String} arg_procedure Name of the procedure 
     * @param {Array.<(Number|String)>} arg_params List of values to pass to procedure
     */
    call: async function(arg_procedure, arg_params){
        return await queryDB(`CALL ${arg_procedure}(${arg_params.join(", ")})`);
    },
    /**
     * Assemble a query and run it against the database using a promisfied version of connection.query
     * 
     * @async
     * @param {String} arg_query SQL Query string with placeholders
     * @param {Array.<Array.<Array.<(Number|String)>>>} arg_values Rank-3 tensor of parameters to pass to the SQL string
     * @see {Connection}
     */
    query: queryDB
}

/**
 * Represents a criteria for filtering database rows
 * @class 
 */
class queryCondition{
    /**
     * @constructor
     * @param {Array.<String>} arg_field List of columns from the table
     * @param {String} arg_operation A string representing a logical operation from the selection of =, !=, IN, REGEX
     * @param {(String|Number)} arg_value Value to compare column entries against
     */
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
     * Returns a string representing the SQL statement representation of the object to be appended to a WHERE statement
     * 
     * @memberof queryCondition
     * @returns {String}
     */
    getString(){
        return this.field + " " + this.operation + " " + (textFields.includes(this.field) ? "\"" + this.value + "\"" : this.value);
    }
}

/**
 * Represents a criteria for sorting database rows
 * @class
 */
class querySort{

    /**
     * @constructor
     * @param {String} arg_field Column from the table
     * @param {String} arg_direction Either ASC or DESC , indicating the direction to which the sort the column
     */
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
     * Returns a string representing the SQL statement representation of the object to be appended to a WHERE statement
     * 
     * @memberof querySort
     * @returns {String}
     */
    getString(){
        return this.field + " " + this.directoin;
    }
}


module.exports = {
    orm: orm, 
    queryCondition: queryCondition,
    querySort: querySort
}