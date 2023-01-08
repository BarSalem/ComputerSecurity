// Server main file
import express from "express";
import fs from "fs";
import tls from "tls";
import path from "path";
import bodyParser from "body-parser";
import https from "https";
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sendChangePasswordName, sendConfirmationEmail } from '../server/node_mailing.js'
import {connection} from '../database/DB_Connect.js'
import { hashPassword, generateRandomString } from "./encryption.js";
import { check_connection, authentication_login, check_email, insert_user, delete_user, update_password, insert_client, delete_client, get_all_clients, sort_by, search } from '../database/DataBase functionality.js'

/*const options = {
    key: fs.readFileSync('localhost.key'),
    cert: fs.readFileSync('localhost.crt'),
    minVersion: tls.Server.TLSv1_2_method
  };*/

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
passport.use(new LocalStrategy(
    function(user_email, password, done) {
        const login_user_status = async () => {
            const result = await authentication_login(connection, user_email, hashPassword(password))
            return result
          }
        if (login_user_status) { return done(null, login_user_status); }
        else { return done(null, false); }
      }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, '/../front')));

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/../front/table-view.html'));
})

app.get('/register', (req, res) => {
    res.status(200).send({ "message": "Register Page" });
})

app.get('/changepasswword', (req, res) => {
    res.status(200).send({ "message": "Change Password Page" });
})

app.get('/forgotpasswordtoken/:id',(req, res) => {})

app.get('/activation/:id', (req, res) => {
    const activatedSuccessed = async () => {
        const result = await activate_user(connection, user_email, req.params.id)
        return result
      }
    if(activatedSuccessed){
        res.status(200).send({ "message": "Your Account has been activated! Log in again please" });
    }
    else{
        res.status(200).send({ "message": "Something went wrong, please try again later!" });
    }
})

app.post('/register', (req, res) => {
    const fname = req.body.fname
    const lname = req.body.lname
    const user_email = req.body.user_email
    const user_password = req.body.password
    const user_phone = req.body.phone_number
    const hashed_password = hashPassword(user_password)
    const user_token = generateRandomString()
    const create_user_status = async () => {
        const result = await insert_user(connection, user_email, fname, lname, user_phone, hashed_password, user_token)
        return result
      }
    if (create_user_status) {
        sendConfirmationEmail(fname, user_email, user_token)
        res.status(200).send({ "message": "You need to activate your account, Visit your mail and look for activation code" });
    }
    else {
        res.status(200).send({ "message": "Account with this email already exists" });
    }
})

app.post('/forgot-password', (req, res) => {
    const user_email = req.body.user_email
    const user_email_exist = async () => {
        const result = await check_email(connection, user_email)
        return result
      }
    if (user_email_exist){
        const user_password_token = generateRandomString()
        sendChangePasswordName(user_email, user_password_token)
        res.status(200).send({ "message": "Changing password page" });
    }   
    else {
        res.status(200).send({ "message": "No user found for the email you mentioned!" });
    }
})

app.post('/change-password', (req,res) =>{
    const newPassword = req.body.newPassword
    const userEmail = req.body.userEmail
    const user_email_exist = async () => {
        const result = await check_email(connection, userEmail)
        return result
      }
    if (user_email_exist){
        const changedUserPassword = async () => {
            const result = await update_password(connection, userEmail, newPassword)
            return result
          }
        if (changedUserPassword){
            res.status(200).send({ "message": "Your password has been changed!" });
        }
        else{
            res.status(404).send({ "message": "Something went wrong..." });
        }
    }
    else{
        res.status(200).send({ "message": "Wrong user email, user doesn't exist!" });
    }

})

app.post('/login', passport.authenticate('local', { failureRedirect: '/' }) ,(req, res) => {
    const user_email = req.body.user_email
    const user_password = req.body.password
    const hashed_password = hashPassword(user_password)
    console.log(user_email, hashed_password)
    const login_user_status = async () => {
        const result = await authentication_login(connection, user_email, hashed_password)
        return result
      }
    if (login_user_status) {
        passport.authenticate('local', { failureRedirect: '/' }),
        res.status(200).send({ "message": "Login successed!" });
        //res.status(200).sendFile(path.join(__dirname + '/../front/'/*the main data screen */));
    }
    else {
        res.status(200).send({ "message": "You must activate your user before logging in, Check your email!" });
    }
})

// console.log(await insert_client(connection, "email11213", "first_name", "last_name", "052521", "city"))
// console.log(await get_all_clients())

// const server = https.createServer(options, app);

app.listen(process.env.PORT, () => { console.log("Server is running on port " + process.env.PORT); })
