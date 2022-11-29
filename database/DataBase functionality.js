const check_connection = async (con) => con.connect((err) => {
    if (err) console.error(err);
    else console.log('Connected...');
});


const authentication_login = async (con, email, password) => {

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


const check_email = async (con, email) => {

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


//don't export
const delete_earliest_password = async (con, email) => {
    let sql_query_delete = `with tbl as(select * from communication_ltd.password_history)
    delete from communication_ltd.password_history where 
    email = ? and creation_date <= all(select tbl.creation_date from tbl)`;
    con.query(sql_query_delete, [email], (err, result) => {
        if (err) {
            return reject(err);
        }
        else {
            console.log(result);
        }
    })

}


//don't export
const update_pass_history = async (con, email, password) => {

    let sql_count_query = `SELECT count(email) AS passNum FROM communication_ltd.password_history WHERE email=?`;

    let sql_add_latest = `INSERT INTO communication_ltd.password_history (email,password,creation_date) VALUES (?, ?, NOW())`;

    con.query(sql_count_query, [email], async (err, result) => {
        if (err) {
            return reject(err);
        }
        else if (result[0].passNum >= 3) {
            await delete_earliest_password(con, email);
            con.query(sql_add_latest, [email, password], async (err, result) => {
                if (err) {
                    return reject(err);
                }
                else {
                    console.log("Password updated...");
                    return;
                }
            })
            return;
        }
        else {
            con.query(sql_add_latest, [email, password], (err, result) => {
                if (err) {
                    return reject(err);
                }
                else {
                    console.log("Added password...");
                    return;
                }
            })
            return;
        }
    })
}


const insert_user = async (con, email, first_name, last_name, phone_number, password, creation_token) => {

    let sql_query_users = `INSERT INTO communication_ltd.users_details (email,first_name,last_name,phone_number,password,creation_token, activated) VALUES (?, ?, ?, ?, ?, ?, 0)`;

    if (await check_email(con, email)) {
        console.log("Already signed up....");
        return;
    }

    else {
        return new Promise(async (resolve, reject) => {
            con.query(sql_query_users, [email, first_name, last_name, phone_number, password, creation_token], async (err, result) => {
                if (err) {
                    return reject(err);
                }

                else {
                    console.log("Added user...");
                    resolve("Added user...");
                }
            });
            await update_pass_history(con, email, password);
        });
    }
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



export { authentication_login, check_email, check_connection, insert_user, delete_user }
















