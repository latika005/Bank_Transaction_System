const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");

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
//So MongoDB stores a sorted lookup structure based on these two fields to make certain queries faster. ⚡

// All the balance we deduce from accounts; the info, comes from a single source of truth "Ledgers"
// So we will create a method on account model to calculate balance by summing up all the 
// ledger entries for that account.
accountSchema.methods.getBalance = async function(){
    // aggregation pipeline in mongodb allows us to run a series of custom queries
    const balanceData = await ledgerModel.aggregate([
        {$match: {  account : this._id } }, // filter ledger entries for this account 
        // 1. We found out all the ledger entries for this account
        // 2. All the ledger entries whose type is DEBIT, we will sum those amounts
        // 3. All the ledger entries whose type is CREDIT, we will sum those amounts
        // 4. Finally we will calculate the balance by subtracting total DEBIT from total CREDIT
        {
            $group : {
                _id: null,
                totalDebit : {
                    $sum: {
                        $cond:[
                            {$eq: ["$type", 'DEBIT'] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit : {
                        $sum : {
                            $cond : [
                                {$eq : ["$type", "CREDIT"]},
                                "$amount",
                                0
                         ] 
                    }
                }
            }
        },
        {
            $project : {
                _id : 0,
                balance : {
                    $subtract : ["$totalCredit", "$totalDebit"]
                }
            }
        }
    ])

    if(balanceData.length === 0){
        return 0; // No ledger entries, so balance is 0
    }

    return balanceData[ 0 ].balance; 
}

const AccountModel = mongoose.model("account", accountSchema);

module.exports = AccountModel;