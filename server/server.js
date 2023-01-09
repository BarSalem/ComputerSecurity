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
import { check_connection, authentication_login, check_email, insert_user, delete_user, update_password, insert_client, delete_client, get_all_clients, sort_by, search, activate_user } from '../database/DataBase functionality.js'

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

app.get('/info', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/../front/table-view.html'));
})

app.get('/register', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/../front/registration-page.html'));
})

app.get('/changepasswword', (req, res) => {
    res.status(200).send({ "message": "Change Password Page" });
})

app.post('/checkemail',async (req, res) => {
    const activatedSuccessed = await check_email(connection, req.body.user_email)
    console.log(activatedSuccessed)
    if (activatedSuccessed) {
        res.status(200).send({ "message": "Your Account has been activated! Log in again please" });
    }
    else {
        res.status(200).send({ "message": "Something went wrong, please try again later!" });
    }
})

app.get('/activation/:id', async (req, res) => {
    const activatedSuccessed = await activate_user(connection, req.params.id)
    if (activatedSuccessed) {
        res.status(200).send({ "message": "Your Account has been activated! Log in again please" });
    }
    else {
        res.status(200).send({ "message": "Something went wrong, please try again later!" });
    }
})

app.post('/register', async (req, res) => {
    const {fname, lname, user_email, password, phone_number} = req.body
    const hashed_password = hashPassword(password)
    const user_token = generateRandomString()
    const create_user_status = await insert_user(connection, user_email, fname, lname, phone_number, hashed_password, user_token)
    console.log(create_user_status)
    if (create_user_status) {
        sendConfirmationEmail(fname, user_email, user_token)
        res.status(200).redirect('/');
    }
    else {
        res.status(200).redirect('/register');
    }
})

app.post('/forgot-password', (req, res) => {
    const user_email = req.body.user_email
    const user_email_exist = async () => {
        const result = await check_email(connection, user_email)
        return result
    }
    if (user_email_exist) {
        const user_password_token = generateRandomString()
        sendChangePasswordName(user_email, user_password_token)
        res.status(200).send({ "message": "Changing password page" });
    }
    else {
        res.status(200).send({ "message": "No user found for the email you mentioned!" });
    }
})

app.post('/change-password', async (req, res) => {
    const newPassword = req.body.new_password
    const userEmail = req.body.user_email
    const new_hashed_password = hashPassword(newPassword)
    const user_email_exist = await update_password(connection, userEmail, new_hashed_password)
    if (user_email_exist) {
        res.status(200).redirect('/');}
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
        res.status(200).redirect('/info')
    }
    else {
        res.status(200).redirect('/');
    }
})

app.post('/add-client', async (req, res) => {
    const {email, fname, lname, phone,city} = req.body;
    const insert_client_status = await insert_client(connection, email, fname, lname, phone,city)
    if (insert_client_status) {
        const all_clients= await get_all_clients(connection, 0)
        res.status(200).send(all_clients);
    }
    else {
        res.status(200).redirect('/');
    }
})

app.get('/getclients', async (req, res) => {
        const all_clients= await get_all_clients(connection, 0)
        res.status(200).send(all_clients);

})

// const server = https.createServer(options, app);

app.listen(process.env.PORT, () => { console.log("Server is running on port " + process.env.PORT); })
