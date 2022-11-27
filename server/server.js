// Server main file
import express from "express";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({path: __dirname + '/../.env'})
app.use(express.static(path.join(__dirname, '/../front')));

app.get('/', (req, res) => {
    console.log(process.env.SECRET)
    res.status(200).sendFile(path.join(__dirname + '/../index.html'));
})

app.get('/register', (req, res) => {
    res.status(200).send({"message":"Register Page"});
})

app.get('/login', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/../front/login-page.html'));
})

app.get('/changepasswword', (req, res) => {
    res.status(200).send({"message":"Login Page"});
})

app.post('/register', (req, res) => {
    const username = req.body.username
    const user_password = req.body.password
    console.log(username, user_password)
    // ... DB function
    res.status(200).send({"message":"After register Page"});
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const user_password = req.body.password
    console.log(username, user_password)
    // ... DB function
    res.status(200).send({"message":"After login Page"});
})

app.listen(process.env.PORT, () => { console.log("Server is running"); })
