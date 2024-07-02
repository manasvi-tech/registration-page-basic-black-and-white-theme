const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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
    },
    tokens:[{
        token:{
            type:String,
            required:true       
        }
    }]
})

//static are functions defined on the models while methods are functions defined on the instance (document)
employeeSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY)  // a unique feature of each instance and a secret private key
        this.tokens  = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch(err){
        res.send(err)
        console.log(err);
    }
}

//converting password into hash
employeeSchema.pre("save", async function (next) { //this is being used for hashing before save 
    // const passwordHash = await bcrypt.hash(password,10);
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }
    next() //next makes sure the save function is completed
})

const Register = new mongoose.model("Register",employeeSchema);

module.exports = Register;