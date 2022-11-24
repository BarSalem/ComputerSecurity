import mysql from 'mysql'

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'communication_ltd'
});

const check_connection = (con) => con.connect(function (err) {
    if (err) console.error(err);
    else console.log('Connected...');
});

// check_connection(connection);
export { connection, check_connection }

