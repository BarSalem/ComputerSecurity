import { resolve } from 'dns';
import { callbackify } from 'util';
import util from 'util'

// import { connection } from './DB_Connect.js'



const check_user = async (con, username, password) => {
    let sql_query = `SELECT username FROM users_details WHERE username = ? AND password = ?`;
    // const query = util.promisify(con.query).bind(con);
    // const [err, res] = await query(sql_query, [username, password]);
    // if (err) throw console.log(err);
    // else return res[0];  //True

    return new Promise((resolve, reject) => {
        con.query(sql_query, [username, password], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
            //resolve(true)
        });
    });
}


// export const insert_user = (username, password) => {
//     connection.query("SELECT * FROM users_details", function (err, result, fields) {
//         if (err) throw err;
//         console.log(result);
//     });
// }




// connection.query("SELECT * FROM users_details", function (err, result) {
//     if (err) throw err;
//     console.log(result);
// });

// const a = await check_user(connection, 'Amit', 'Amit100');
// console.log(a);
// connection.end();


export { check_user }
















