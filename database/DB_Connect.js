import config from "../configuration.json" assert { type: "json" };
import mysql from "mysql";
import {
  check_connection,
  authentication_login,
  check_user_email,
  check_client_email,
  insert_user,
  delete_user,
  update_password,
  insert_client,
  delete_client,
  get_all_clients,
  sort_by,
  search,
  activate_user,
  forgot_pass,
  check_login_attempts
} from "./DataBase_functionality.js";
import dotenv from "dotenv";
dotenv.config();

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//check_connection(connection)
//delete_user(connection, "Amit1@gmail.com")
// await insert_user(
//   connection,
//   "Tomer@gmail.com",
//   "Tomer",
//   "Haina",
//   "0525555443",
//   "Tomer100",
//   "657657657657"
// );
// await insert_user(
//   connection,
//   "Amit@gmail.com",
//   "Amit",
//   "Amazing",
//   "0525555443",
//   "Tomer100",
//   "657657657657"
// );
// await insert_user(
//   connection,
//   "Bar@gmail.com",
//   "Bar",
//   "Salem",
//   "0525555443",
//   "Tomer100",
//   "657657657657"
// );
//await authentication_login(connection, "Nati@gmail.com", "123456");
//await update_password(connection, "Amit1@gmail.com", "Amit102");
// await insert_client(
//   connection,
//   "Bar@gmail.com",
//   "Bar",
//   "Salem",
//   "0525381648",
//   "Holon"
// );
// await insert_client(
//   connection,
//   "Eli@gmail.com",
//   "Eli",
//   "Cohen",
//   "0525881648",
//   "Yehud"
// );
//await delete_client(connection, "Bar@gmail.com");
// console.log(await get_all_clients(connection, 0));
// console.log(await sort_by(connection, config.DB.tables.clients.fields.last_name));
// console.log(await search(connection, "b", 5))

// connection.end()


