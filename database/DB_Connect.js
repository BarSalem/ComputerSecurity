import config from '../configuration.json' assert {type: 'json'};
import mysql from 'mysql'
import { authentication_login, check_email, check_connection, insert_user, delete_user } from './DataBase functionality.js'

var connection = mysql.createConnection({
    host: config.DB.host,
    user: config.DB.user,
    password: config.DB.password,
    database: config.DB.db_name
});

//check_connection(connection)
//delete_user(connection, "Amit@gmail.com")
const a = await insert_user(connection, "Amit@gmail.com", "Amit", "Mashu", "0522222222", "Amit100", "1234567890");
const b = await authentication_login(connection, "Amit@gmail.com");
// update_pass_history(connection, "Amit@gmail.com", "Amit100");
// console.log(b);


connection.end()


