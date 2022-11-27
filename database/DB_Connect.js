import mysql from 'mysql'
import { check_user } from './DataBase functionality.js'

// how to create connection and table in it nodejs? 
// var pool = mysql.createPool({
//     connectionLimit: 10,
//     host: 'localhost',
//     user: 'root',
//     password: '123456'
// });


// pool.getConnection((err, connection) => {
//     if (err) {
//         return cb(err);
//     }
//     connection.query("CREATE DATABASE IF NOT EXISTS communication_ltd", (err, data) => {
//         connection.release();
//         cb(err, data);
//     });
// });


// connection.changeUser({ database: "communication_ltd" });


// pool.getConnection((err, connection) => {
//     if (err) {
//         return cb(err);
//     }
//     connection.changeUser({ database: "communication_ltd" });
//     let createTodos = `create table if not exists mytable(
//                           id int primary key auto_increment,
//                           title varchar(255)not null,
//                           testdata tinyint(1) not null default 0
//                       )`;

//     connection.query(createTodos, function (err, results, fields) {
//         if (err) {
//             console.log(err.message);
//         };
//     });
// });









var connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'communication_ltd'
});

const check_connection = async (con) => con.connect(function (err) {
    if (err) console.error(err);
    else console.log('Connected...');
});





check_connection(connection);
const a = await check_user(connection, "Amit", "Amit100");
console.log(a);
connection.end()
//export { connection, check_connection }





