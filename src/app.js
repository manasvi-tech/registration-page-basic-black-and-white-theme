require('dotenv').config()
const express = require('express')
const hbs = require('hbs');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require("cookie-parser");
const port = process.env.PORT;

require("./db/conn");
const Register = require("./models/register");
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth')
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false})) // i want to get all the data of the form

const staticPath = path.join(__dirname,"../public");
const templatePath = path.join(__dirname,"../templates/views");
const partialsPath = path.join(__dirname,"../templates/partials");

app.use(express.static(staticPath));
app.set("view engine","hbs");
app.set("views",templatePath);
hbs.registerPartials(partialsPath);

app.get('/',(req,res)=>{
    res.render("register");
})


app.get('/secret',auth,(req,res)=>{ //auth is the middleware function
    // console.log(`this is cookie ${req.cookies.jwt}`)
    res.render("secret");
})

//create a new user in the database
app.post('/',async (req,res)=>{
    try{
        const registerEmployee = new Register({
            name : req.body.username,
            email : req.body.email,
            password : req.body.password
        })
        //hashing before saving into database
        // this is called concept of middleware

        //authentication and token using jwot
        //this is also middleware
       
        //console.log("The success part" + registerEmployee)
        const token = await registerEmployee.generateAuthToken(); //defined in register.js
        
        //res.cookie() function is used to set the cookie name to value
        // the value parameter may be a string or object converted to json
        res.cookie("jwt", token) // cookie name and value;

       
       console.log("cookie made");
        const registered = registerEmployee.save();
        res.status(200).render("index");

    }catch(err){
        res.status(400).send("There is an error here"+err);
    }
})

//login check
app.post('/login', async(req,res)=>{
    try{
        const email = req.body.email;
        const pass = req.body.password;

        // console.log(`${email} with its ${pass}`);
        const userEmail = await Register.findOne({email:email});
        

        const isMatch = await bcrypt.compare(pass, userEmail.password)
        
        //console.log(isMatch);

        const token = await userEmail.generateAuthToken();
        //console.log(token);

        res.cookie("jwt", token,
            //secure:true
        ) // cookie name and value;


        if(isMatch){
            res.status(201).render("index");
        } else{
            res.send("Invalid details");
        }

    }catch(err){
        res.status(400).send(err);
    }
})

app.get('/home',(req,res)=>{
    res.render("index");
})


app.listen(port,(req,res)=>{
    console.log(`server is running at ${port}`);
});