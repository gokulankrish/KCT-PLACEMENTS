const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host:process.env.LoginHost,
    user:process.env.LoginUser,
    password:process.env.LoginPassword,
    database:process.env.LoginDatabase
});

exports.register = (req,res) =>
{
    console.log(req.body);

    /*const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;*/

    //above can also same as below
    const { username , email , password , confirmpassword } = req.body;

    db.query('SELECT email FROM logininfo WHERE email = ?' , [email] , async(error,results) =>
    {
        if(error)
        {
            console.log(error);
        }

        if( results.length > 0)
        {
            return res.render('register', {
                message:'Email already in registered'
            })
        }
        else if( password !== confirmpassword ){
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }

        let hashedpassword = await bcrypt.hash(password, 8);
        console.log(hashedpassword);

        db.query('INSERT INTO logininfo SET ?',{ username : username , email : email , password: hashedpassword } , (error,results) =>
        {
            if(error)
            {
                console.log(error);
            }
            else{
                console.log(results);
                return res.render('register',{
                    message:'User registered'
                });
            }
        });


    });
}

exports.loginpage = async(req,res) =>
{
    try{
        const { email , password } = req.body;

        if( !email || !password )
        {
            return res.status(400).render('loginpage',{
                message1:'Please provide email / password'
            })
        }

        db.query('SELECT * FROM logininfo WHERE email = ?',[email],async(error,results)=>
        {
            if( error )
            {
                console.log(error);
            }
            console.log(results);
            if( !results || !(await bcrypt.compare( password , results[0].password ) ) )
            {
                res.status(401).render('loginpage',{
                    message1:'Incorrect Email / Password'
                })
            }
            else{
                const id = results[0].id;

                const token = jwt.sign({ id : id },process.env.JWT_SECRET,{
                    expiresIn : process.env.JWT_EXPIRES_IN
                });
                
                console.log("The token is "+token);

                const cookieoptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24*60*60*1000
                    ),
                    httpOnly:true
                }

                res.cookie('jwt',token,cookieoptions);
                res.status(200).redirect("/home");
            }
            
        })
    }
    catch(error)
    {
        console.log(error);
    }
}