// Server main file
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import passport from 'passport';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sendChangePasswordName, sendConfirmationEmail } from '../server/node_mailing.js'
import { connection } from '../database/DB_Connect.js'
import { hashPassword, generateRandomString } from "./encryption.js";
import {   check_connection,
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
    check_login_attempts } from '../database/DataBase_functionality.js'

/*const options = {
    key: fs.readFileSync('localhost.key'),
    cert: fs.readFileSync('localhost.crt'),
    minVersion: tls.Server.TLSv1_2_method
  };*/

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, '/../front')));

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/../front/login-page.html'));
})

app.get('/info', async (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/../front/table-view.html'));
})

app.get('/register', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/../front/registration-page.html'));
})

app.get('/forgotpassword', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/../front/forgot-password.html'));
})

/*app.get('/:id', (req, res) => {
    // activate password token of user
    res.status(200).sendFile(path.join(__dirname + '/../front/change-password.html'));
})*/

app.get('/activationsuccess', async (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/../front/activation-page.html'));
})

app.get('/activation/:id', async (req, res) => {
    const activatedSuccessed = await activate_user(connection, req.params.id)
    console.log(activatedSuccessed)
    if (activatedSuccessed) {
        res.status(200).redirect('/activationsuccess');
    }
    else {
        res.status(404).send({ "message": "Something went wrong, please try again later!" });
    }
})

app.post('/register', async (req, res) => {
    const {fname, lname, user_email, user_password, user_phone} = req.body
    console.log(user_email, fname, lname, user_password, user_phone)
    const hashed_password = hashPassword(user_password)
    const user_token = generateRandomString()
    const create_user_status = await insert_user(connection, user_email, fname, lname, user_phone, hashed_password, user_token)
    console.log(create_user_status)
    if (create_user_status) {
        sendConfirmationEmail(fname, user_email, user_token)
        res.status(200).send({result: 'redirect', url:'/', message:"Go activate your account in the email"})
    }
    else {
        res.status(200).send({message:"This email is already used"});
    }
})

app.post('/forgot-password', async (req, res) => {
    const user_email = req.body.user_email
    const user_email_exist = await check_user_email(connection, user_email)
    if (user_email_exist) {
        forgot_password_succ = forgot_pass(connection, user_email, user_password_token)
        const user_password_token = generateRandomString()
        sendChangePasswordName(user_email, user_password_token)
    }
    res.status(200).send({ "message": "If the user exist, the mail has been sent!" });
})

app.post('/change-password', async (req, res) => {
    const newPassword = req.body.new_password
    const new_hashed_password = hashPassword(newPassword)
    console.log('check' + new_hashed_password)
    //const user_email_exist = await update_password(connection, userEmail, new_hashed_password)
    if (true) {
        res.status(200).send({result: 'redirect', url:'/', message:"Please log-in with the new password"});}
    else {
            res.status(404).send({ "message": "Something went wrong..." });
        }
    })

app.post('/login', async (req, res) => {
    const user_email = req.body.user_email
    const user_password = req.body.password
    const hashed_password = hashPassword(user_password)
    const login_user_status = await authentication_login(connection, user_email, hashed_password)
    if (login_user_status) {
        res.status(200).send({result: 'redirect', url:'/info'})
    }
    else {
        res.status(200).send({error: "Wrong credentials"})
    }
})

app.post('/add-client', async (req, res) => {
    const {email, fname, lname, phone,city} = req.body;
    const insert_client_status = await insert_client(connection, email, fname, lname, phone,city)
    console.log(insert_client_status)
    if (insert_client_status) {
        res.status(200).send({result: 'redirect', url:'/info'});
    }
    else {
        res.status(200).redirect('/');
    }
})

app.post('/del-client', async (req, res) => {
    const insert_client_status = await delete_client(connection, req.body.email)
    if (insert_client_status) {
        res.status(200).send({result: 'redirect', url:'/info'});
    }
    else {
        res.status(200).redirect('/');
    }
})

// console.log(await insert_client(connection, "email11213", "first_name", "last_name", "052521", "city"))
// console.log(await get_all_clients())



app.get('/getclients', async (req, res) => {
        const all_clients= await get_all_clients(connection, 0)
        console.log(all_clients)
        res.status(200).send(all_clients);
})

// const server = https.createServer(options, app);

app.listen(process.env.PORT, () => { console.log("Server is running on port " + process.env.PORT); })
