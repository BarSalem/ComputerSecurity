import config from '../configuration.json' assert {type: 'json'};


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
                console.log("inside authentication_login - true");
                resolve(true)
            }
            else {
                console.log("inside authentication_login - false");
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
    return new Promise((resolve, reject) => {
        con.query(sql_query_delete, [email], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.length != 0) {
                //resolve(result);
                console.log('inside delete_earliest_password = true');
                resolve(true)
            }
            else {
                console.log('inside delete_earliest_password = false');
                resolve(false)
            }
        })
    });

}

//don't export
const update_pass_history = async (con, email, password) => {

    let sql_count_query = `SELECT count(email) AS passNum FROM communication_ltd.password_history WHERE email=?`;

    let sql_add_latest = `INSERT INTO communication_ltd.password_history (email,password,creation_date) VALUES (?, ?, NOW())`;

    return new Promise((resolve, reject) => {
        con.query(sql_count_query, [email], async (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result[0].passNum >= config.password.history_limit) {
                //resolve(result);
                console.log('inside update_pass_history = pass history is full');
                await delete_earliest_password(con, email);
                con.query(sql_add_latest, [email, password], (err, result) => {
                    if (err) {
                        return reject(err)
                    }
                    else {
                        console.log("inside update_pass_history - Password updated...");
                        resolve(true);
                    }
                })
            }
            else {
                con.query(sql_add_latest, [email, password], (err, result) => {
                    if (err) {
                        return reject(err)
                    }
                    else {
                        console.log("inside update_pass_history - Added password...");
                        resolve(true);
                    }
                })
            }
        })
    });
}


const update_password = async (con, email, new_pass) => {
    let sql_update_query = `UPDATE users_details
    SET password = ?
    WHERE email = ?;`

    return new Promise(async (resolve, reject) => {
        let emailExists = await check_email(con, email);
        if (!emailExists) {
            return reject("User is no exists!");
        }
        con.query(sql_update_query, [new_pass, email], async (err, result) => {
            if (err) {
                return reject(err);
            }
            else {
                console.log("inside update_password - done!");
                await update_pass_history(con, email, new_pass);
                resolve(true)
            }
        })
    })
}


const insert_user = async (con, email, first_name, last_name, phone_number, password, creation_token) => {

    let sql_query_users = `INSERT INTO communication_ltd.users_details (email,first_name,last_name,phone_number,password,creation_token, activated) VALUES (?, ?, ?, ?, ?, ?, 0)`;

    return new Promise((resolve, reject) => {
        con.query(sql_query_users, [email, first_name, last_name, phone_number, password, creation_token], async (err, result) => {
            if (err) {
                return reject(err);
            }

            else {
                console.log("inside insert_user - Added user...");
                await update_pass_history(con, email, password).then((value) => {
                    if (value === false) {
                        console.log("inside insert_user - pass error -> user was not created");
                        delete_user(con, email);
                    }
                })
                resolve(true);
            }
        });

    });
}


const delete_client = async (con, email) => {

    let sql_query_users = `DELETE FROM clients WHERE email=?`;

    return new Promise((resolve, reject) => {
        con.query(sql_query_users, [email], (err, result) => {
            if (err) {
                return reject(err);
            }
            else {
                console.log("Client deleted...");
                resolve(true);
            }
        });

    });
}


const insert_client = async (con, email, first_name, last_name, phone_number, city) => {

    let sql_query_users = `INSERT INTO communication_ltd.clients (email,first_name,last_name,phone_number,city) VALUES (?, ?, ?, ?, ?)`;

    return new Promise(async (resolve, reject) => {
        con.query(sql_query_users, [email, first_name, last_name, phone_number, city], (err, result) => {
            if (err) {
                return reject(err);
            }

            else {
                console.log("inside insert_client - Added client...");
                resolve(true);
            }
        });
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


const get_all_clients = async (con) => {
    let sql_get_table_query = `SELECT * FROM clients`;

    return new Promise((resolve, reject) => {
        con.query(sql_get_table_query, (err, result) => {
            if (err) {
                return reject(err);
            }
            else {
                resolve(result)
            }
        })
    })
}


const sort_by = async (con, column_name) => {
    let sql_sort_query = `SELECT * FROM clients ORDER BY ` + column_name + ` ASC;`;
    return new Promise((resolve, reject) => {
        con.query(sql_sort_query, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        })
    })
}


const search = async (con, search_string) => {
    let sql_search_query = `SELECT * FROM clients WHERE email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ? OR city LIKE ?`;
    return new Promise((resolve, reject) => {
        con.query(sql_search_query, ["%" + search_string + "%", "%" + search_string + "%", "%" + search_string + "%", "%" + search_string + "%", "%" + search_string + "%"], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result)
            }
        })
    })
}


export { check_connection, authentication_login, check_email, insert_user, delete_user, update_password, insert_client, delete_client, get_all_clients, sort_by, search }