const express = require('express');

const router = express.Router();

router.get('/',(req,res) =>
{
    res.render('loginpage');
});

router.get('/home',(req,res) =>
{
    res.render("home");    
});

router.get('/register',(req,res) =>
{
    res.render("register");    
});

router.get('/forgotPassword',(req,res) =>
{
    res.render("forgotPassword");    
});

//exporting the routes given above
module.exports = router;