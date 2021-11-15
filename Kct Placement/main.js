const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser= require('cookie-parser');

const app = express();

dotenv.config({path:'./.env'});


const db = mysql.createConnection({
    host:process.env.LoginHost,
    user:process.env.LoginUser,
    password:process.env.LoginPassword,
    database:process.env.LoginDatabase
});


const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended:false}));
app.use(express.json());

app.use(cookieParser());

app.set('view engine','hbs');

db.connect( (error) =>
{
    if(error)
    {
        console.log(error);
    }
    else{
        console.log("Database connected.");
    }
});

//Routes of the pages are connected to routes/pageroutes
app.use('/',require('./routes/pageroutes'));
app.use('/info',require('./routes/info'));

app.listen(5555, () =>
{
    console.log("We are in port 5555.");
});