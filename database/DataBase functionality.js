const check_connection = async (con) => con.connect((err) => {
    if (err) console.error(err);
    else console.log('Connected...');
});


const authentication = async (con, email, password) => {

    let sql_query = `SELECT email FROM users_details WHERE email = ? AND password = ?`;

    return new Promise((resolve, reject) => {
        con.query(sql_query, [email, password], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.length != 0) {
                //resolve(result);
                resolve(true)
            }
            else {
                resolve(false)
            }
        });
    });
}


const check_user = async (con, email) => {

    let sql_query = `SELECT email FROM users_details WHERE email = ?`;

    return new Promise((resolve, reject) => {
        con.query(sql_query, [email], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.length != 0) {
                //resolve(result);
                resolve(true)
            }
            else {
                resolve(false)
            }
        });
    });
}


const insert_user = async (con, email, first_name, last_name, phone_number, password, creation_token, activated) => {

    let sql_query_users = `INSERT INTO communication_ltd.users_details (email,first_name,last_name,phone_number,password,creation_token, activated) VALUES (?, ?, ?, ?, ?, ?, 0)`;

    let sql_query_passwords = `INSERT INTO communication_ltd.password_history (email,password,creation_date) VALUES (?, ?, NOW())`;

    return new Promise((resolve, reject) => {
        con.query(sql_query_users, [email, first_name, last_name, phone_number, password, creation_token], (err, result) => {
            // if (err) {
            //     return reject(err);
            // }
            if (check_user(con, email)) {
                return resolve("Already signed up....");
            }
            else {
                resolve("Added user...")
            }
        });

        // con.query(sql_query_passwords, [email, password], (err, result) => {
        //     // if (err) {
        //     //     return reject(err);
        //     // }
        //     if (check_user(con, email)) {
        //         return reject("Already signed up....");
        //     }
        //     else {
        //         resolve("Added password...")
        //     }
        // });

    });
}


const delete_user = async (con, email) => {

    let sql_query_users = `DELETE FROM users_details WHERE email=?`;

    let sql_query_passwords = `DELETE FROM password_history WHERE email=?`;

    return new Promise((resolve, reject) => {
        con.query(sql_query_users, [email], (err, result) => {
            if (err) {
                return reject(err);
            }
            else {
                console.log("User deleted...");
            }
        });

        con.query(sql_query_passwords, [email], (err, result) => {
            if (err) {
                return reject(err);
            }
            else {
                console.log("Password deleted...");
            }
        });
    });
}



export { authentication, check_user, check_connection, insert_user, delete_user }
















