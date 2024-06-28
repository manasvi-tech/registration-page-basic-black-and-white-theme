const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/registration-tut').then(()=>{ //registration-tut is the name of the database
    console.log("mongoose connection succesful");
}).catch((err)=>{
    console.log(err);
})
