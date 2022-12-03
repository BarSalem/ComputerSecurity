// Server main file
import express from "express";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {sendChangePasswordName, sendConfirmationEmail} from '../server/node_mailing.js'

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({path: __dirname + '/../.env'})
app.use(express.static(path.join(__dirname, '/../front')));

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/../front/login-page.html'));
})

app.get('/register', (req, res) => {
    res.status(200).send({"message":"Register Page"});
})

app.get('/changepasswword', (req, res) => {
    res.status(200).send({"message":"Change Password Page"});
})

app.get('/activation/:id', (req, res) => {
    res.status(200).send({"message":"Your Account has been activated! Log in again please"});
})

app.post('/register', (req, res) => {
    const name = req.body.name
    const username = req.body.username
    const user_password = req.body.password
    // generate hash key
    // ... DB function
    if(true){
        sendConfirmationEmail(name,username,"123456"/*will be replaced with hash key*/)
        res.status(200).send({"message":"You need to activate your account, Visit your mail and look for activation code"});
    }
    else{
        res.status(200).send({"message":"Account with this email already exists"});
    }
})

app.post('/forgot-password', (req, res) => {
    const username = req.body.username
    // generate hash key as new password
    // ... DB function
    if(true){
        sendChangePasswordName(username,/*hashkey as new password*/)
        res.status(200).send({"message":"You need to activate your account, Visit your mail and look for activation code"});
    }
    else{
        res.status(200).send({"message":"No user found for the email you mentioned!"});
    }
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const user_password = req.body.password
    console.log(username, user_password)
    // ... DB function
    if(true)/*check if user exists and activated*/
    {
        res.status(200).sendFile(path.join(__dirname + '/../front/'/*the main data screen */));
    }
    else{
        if(user_not_exist){
            res.status(200).send({"message":"No user found for the email you mentioned!"});
        }
        else{
            res.status(200).send({"message":"You must activate your user before logging in, Check your email!"});
        }
    }
})

app.listen(process.env.PORT, () => { console.log("Server is running"); })
