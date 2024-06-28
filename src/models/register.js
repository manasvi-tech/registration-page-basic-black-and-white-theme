const mongoose = require('mongoose');
const validator = require('validator')

const employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please enter correct email");
            }
        }
    },
    password:{
        type:String,
        required:true
    }
})

const Register = new mongoose.model("Register",employeeSchema);

module.exports = Register;