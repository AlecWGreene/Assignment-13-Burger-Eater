DROP DATABASE IF EXISTS burger_db;
CREATE DATABASE burger_db;

USE burger_db;

CREATE TABLE user_table(id INT AUTO_INCREMENT PRIMARY KEY, user_name VARCHAR(30) NOT NULL, user_display VARCHAR(30) NOT NULL, user_hash VARCHAR(255) NOT NULL, logged_in BOOL DEFAULT FALSE);

-- Procedure for creating new table for user --
DELIMITER //
CREATE PROCEDURE create_table(IN arg_id INT)
BEGIN
    SET @dropTable = CONCAT("DROP TABLE IF EXISTS burger_table_", arg_id, ";");
    SET @createTable = CONCAT("CREATE TABLE burger_table_", arg_id, "(id INT AUTO_INCREMENT PRIMARY KEY, burger_name VARCHAR(30) NOT NULL, ingredients INT);");

    -- Drop the table --
    PREPARE command_drop FROM @dropTable;
    EXECUTE command_drop;

    -- Create table --
    PREPARE command_create FROM @createTable;
    EXECUTE command_create;
END//
DELIMITER ;