const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    fromAccount : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "account",
        required : [true, "Transaction needs to be associated with a source account"],
        index : true,
    },
    toAccount : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "account",
        required : [true, "Transaction needs to be associated with a destination account"],
        index : true,
    },
    transactionStatus : {
        type : String,
        enum : {
            values : ["PENDING", "COMPLETED", "FAILED"],
            message : "Transaction status can be PENDING, COMPLETED or FAILED",
        }
    },
    amount : {
        type : Number,
        required : [true, "Transaction amount is required"],
        min : [1, "Transaction must be greater than 0"]
    },
    idempotencyKey : {
        type : String,
        required : [true, "Indempotency is required for a transaction"],
        unique : true, // ensures that each transaction has a unique idempotency key to prevent duplicate transactions
        index : true,
    }
}, {
    timestamps : true,
})

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;