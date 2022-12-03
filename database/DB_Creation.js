import config from '../configuration.json' assert {type: 'json'};
import mysql from 'mysql'


var con = mysql.createConnection({
    host: config.DB.host,
    user: config.DB.user,
    password: config.DB.password
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE IF NOT EXISTS " + config.DB.db_name, (err, result) => {
        if (err) throw err;
        console.log("Database created");
    });
    con.end()
});

con.changeUser({ database: config.DB.db_name }, (err) => {
    if (err) throw err;
});


let sql_users_table = "CREATE TABLE IF NOT EXISTS " + config.DB.db_name + "." + config.DB.tables[0] +
    "(`email` VARCHAR(50) NOT NULL, `first_name` VARCHAR(45) NOT NULL, `last_name` VARCHAR(45) NOT NULL, `phone_number` VARCHAR(10) NOT NULL, `password` VARCHAR(45) NOT NULL, `creation_token` VARCHAR(45) NOT NULL, `activated` TINYINT NOT NULL, PRIMARY KEY(`email`))"


con.query(sql_users_table, function (err, result) {
    if (err) throw err;
    console.log("Users table created");
});



let sql_history_table = "CREATE TABLE IF NOT EXISTS " + config.DB.db_name + "." + config.DB.tables[1] +
    "(`email` VARCHAR(50) NOT NULL, `password` VARCHAR(45) NOT NULL,`creation_date` DATE NOT NULL, PRIMARY KEY(`email`, `password`))"


con.query(sql_history_table, function (err, result) {
    if (err) throw err;
    console.log("Password history table created");
});
