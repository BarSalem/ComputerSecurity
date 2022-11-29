import config from '../configuration.json' assert {type: 'json'};
import mysql from 'mysql'
import { authentication, check_user, check_connection, insert_user, delete_user } from './DataBase functionality.js'

var connection = mysql.createConnection({
    host: config.DB.host,
    user: config.DB.user,
    password: config.DB.password,
    database: config.DB.db_name
});

//check_connection(connection)
const a = await insert_user(connection, "Amit@gmail.com", "Amit", "Mashu", "0522222222", "Amit100", "1234567890");
const b = await authentication(connection, "Amit@gmail.com", "Amit100");
console.log(a);
console.log(b);

// connection.query('SHOW COLUMNS FROM ' + config.DB.tables.users_details.table_name, function (err, rows, fields) {
//     console.log(rows);
// });


connection.end()



