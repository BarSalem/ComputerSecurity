// Server main file
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import fs from 'fs';
import tls from 'tls';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sendChangePasswordName, sendConfirmationEmail } from '../server/node_mailing.js'
import { connection } from '../database/DB_Connect.js'
import { hashPassword, generateRandomString } from "./encryption.js";
import {   check_connection,get_user_name,
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
    update_password_token,
    check_login_attempts } from '../database/DataBase_functionality.js'


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, '/../front')));

/*const options = {
    key: fs.readFileSync(path.join(__dirname,'localhost.key')),
    cert: fs.readFileSync(path.join(__dirname,'./localhost.crt')),
    minVersion: tls.Server.TLSv1_2_method
  };*/

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

app.get('/changepassword:id', (req, res) => {
    // activate password token of user
    res.status(200).sendFile(path.join(__dirname + '/../front/change-password.html'));
})

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
        const user_password_token = generateRandomString()
        const forgot_password_succ = await forgot_pass(connection, user_email, user_password_token)
        if (forgot_password_succ){
            sendChangePasswordName(user_email, user_password_token)
        }
    }
    res.status(200).send({ "message": "If the user exist, the mail has been sent!" });
})

app.post('/change-password', async (req, res) => {
    const token = req.body.token
    const newPassword = req.body.new_password
    const new_hashed_password = hashPassword(newPassword)
    const user_email_exist = await update_password_token(connection, new_hashed_password, token)
    console.log(user_email_exist);
    if (user_email_exist) {
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
        const user_name = await get_user_name(connection,user_email)
        res.status(200).send({result: 'redirect', url:'/info', name: user_name})
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

app.post('/changepasswordlogged', async (req, res) => {
    const {email, user_old_password, user_new_password} = req.body
    const hashed_old_password = hashPassword(user_old_password)
    const hashed_new_password = hashPassword(user_new_password)
    const insert_client_status = await update_password(connection, email, hashed_old_password, hashed_new_password)
    if (insert_client_status) {
        res.status(200).send({result: 'redirect', url:'/', message:'If the credentials correct your password has been changed'});
    }
    else {
        res.status(200).redirect('/');
    }
})

app.post('/searchclient', async (req,res) =>{
    console.log(req.body.search_string);
    const deleted_user = await delete_user(connection, req.body.email);
    if(deleted_user) res.status(200).send({result: 'redirect', url:'/', message:'If the credentials correct your password has been changed'});
})

app.get('/getclients', async (req, res) => {
        const all_clients= await get_all_clients(connection, 0)
        console.log(all_clients)
        res.status(200).send(all_clients);
})

app.post('/temp', async (req,res) =>{
    const deleted_user = await delete_user(connection, req.body.email);
    if(deleted_user) res.status(200).send({result: 'redirect', url:'/', message:'If the credentials correct your password has been changed'});
})

//const server = tls.createServer(options, app);

app.listen(process.env.PORT, () => { console.log("Server is running on port " + process.env.PORT); })
