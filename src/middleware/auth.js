const jwt = require('jsonwebtoken');
const Register = require("../models/register");

const auth = async (req,res,next) => {
    // console.log("here")
    try{    
        const token = req.cookies.jwt;
        // console.log(token);
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY); 
        console.log(verifyUser)

        const user = await Register.findOne({_id:verifyUser._id}) //getting the details of that user
        console.log(user);

        next();
    } 
    catch(err){
        res.status(400).send("This is an error"+err)
    }
}

module.exports = auth;