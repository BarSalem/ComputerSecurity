import { connection } from './DB_Connect.js'

export const insert_user = (username, password) => {
    connection.query("SELECT * FROM users_details", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
}




connection.query("SELECT * FROM users_details", function (err, result) {
    if (err) throw err;
    console.log(result);
});
connection.end();

















