import config from '../configuration.json' assert {type: 'json'};
import mysql from 'mysql'
import { check_connection, authentication_login, check_email, insert_user, delete_user, update_password, insert_client, delete_client, get_all_clients, sort_by, search } from './DataBase functionality.js'

export var connection = mysql.createConnection({
    host: config.DB.host,
    user: config.DB.user,
    password: config.DB.password,
    database: config.DB.db_name
});

//check_connection(connection)
//delete_user(connection, "Amit1@gmail.com")
//await insert_user(connection, "Amit@gmail.com", "Amit", "Amazing", "0525555443", "Amit100", "657657657657");
//await authentication_login(connection, "Nati@gmail.com", "123456");
//await update_password(connection, "Amit1@gmail.com", "Amit102");
//await insert_client(connection, "Bar@gmail.com", "Bar", "Salem", "0525381648", "Holon");
//await insert_client(connection, "Eli@gmail.com", "Eli", "Cohen", "0525881648", "Yehud");
//await delete_client(connection, "Bar@gmail.com");
// console.log(await get_all_clients(connection));
// console.log(await sort_by(connection, config.DB.tables.clients.fields.last_name));
console.log(await search(connection, "@"))

connection.end()


