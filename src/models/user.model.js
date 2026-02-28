const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : [true, "Email address is required"],
        trim : true,
        unique : [true, "Email address already exists"],
        lowercase : true,
        match: [
            /^\S+@\S+\.\S+$/,
            'Please fill a valid email address'
          ]
    },
    name : {
        type :  String,
        required : [true, "Name is required"],
        trim : true,
    },
    password : {
        type : String,
        required : [true, "Password is required for creating an account"],
        minlength: [6, "Password must be at least 6 characters long"],
        trim : true,
        select : false // this will prevent the password from being returned in any query by default, it returns only when we explicitly ask for it
    }

}, {
    timestamps : true,
})

// Everytime before the user-data is saved to the database, 
// this function will be executed and we can perform any 
// operations on the user-data before it is saved to the database,
// for example we can hash the password before saving it to the database

// Before a document is saved to MongoDB, run this function.
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})
//“Add custom methods to each document created from this schema.”
// any user you create will now have this method available.
// it creates a custom method called "comparePassword" 
// that can be used to compare a plain text password with the hashed 
// password stored in the database. 
// This is useful for authentication purposes, 
// allowing you to verify if a user's inputted password matches 
// the one stored in the database.
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
    
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;