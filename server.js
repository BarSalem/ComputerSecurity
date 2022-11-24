// Server main file
const express = require('express');
const dotenv = require('dotenv').config()
const path = require('path');
const app = express();

app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + "/server.js");
})

app.get('/register', (req, res) => {
    res.status(200).send({"message":"Register Page"});
})

app.get('/login', (req, res) => {
    res.status(200).send({"message":"Login Page"});
})


app.listen(8080, () => { console.log("Server is running"); })
