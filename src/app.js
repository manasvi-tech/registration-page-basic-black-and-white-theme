const express = require('express')
const hbs = require('hbs');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const port = process.env.PORT || 3000;

require("./db/conn");
const Register = require("./models/register");
app.use(express.json());
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
        
        const registered = registerEmployee.save();
        res.status(200).render("index");
    }catch(err){
        res.status(400).send(err);
    }
})

//login check
app.post('/login', async(req,res)=>{
    try{
        const email = req.body.email;
        const pass = req.body.password;

        // console.log(`${email} with its ${pass}`);
        const userEmail = await Register.findOne({email:email});
        console.log(userEmail);

        const isMatch = await bcrypt.compare(pass, userEmail.password)
        console.log(isMatch);
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