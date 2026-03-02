const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    user : {
        // Refers to user, so we can populate the account with user data when needed
        type : mongoose.Schema.Types.ObjectId, // creates relationship between user and it`s account
        ref : "user",
        required : [true , "Account must be associated with a user"],
        index : true // creates an index on the user field for faster queries
    },
    status : {
        type : String,
        enum : {  // This field is allowed to contain only one value from a predefined list for an account.
            values : ["ACTIVE" , "FROZEN", "CLOSED"],
            message : "Status can be ACTIVE, FROZEN or CLOSED",
               },
        default : "ACTIVE"
             },
    currency : {
        type : String,
        required : [true , "Currency is required for creating an account"],
        default : "INR"
    },
}, 
{
    timestamps : true
})

accountSchema.index({user : 1, status : 1}) // creates a compound index on user and status fields for faster queries filtering by these fields

const AccountModel = mongoose.model("account", accountSchema);

module.exports = AccountModel;