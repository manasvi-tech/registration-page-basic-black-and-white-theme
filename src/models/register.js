const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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

employeeSchema.pre("save", async function (next) { //this is being used for hashing before save 
    // const passwordHash = await bcrypt.hash(password,10);
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }
    next() //next makes sure the save function is completed
})

const Register = new mongoose.model("Register",employeeSchema);

module.exports = Register;