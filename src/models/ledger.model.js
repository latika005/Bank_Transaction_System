const mongoose = require("mongoose");
//  Ledger means "the master record-keeping system, either digital or physical,
//  that records all financial transactions (debits and credits) in chronological order,
//  acting as the foundation of accounting)"

const ledgerSchema = new mongoose.Schema({
    account : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "account",
        required : [true, "Ledger entry needs to be associated with an account"],
        immutable : true,
        indx : true,
    },
    amount : {
        type : Number,
        required : [true, "Ledger amount is required"],
        default : [0, "Ledger amount cannot be negative"],
        immutable : true,
    },
    transaction : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required : [true, "ledger is associated with a transaction"],
        index : true,
        immutable : true,
    },
    type : {
        type : String,
        enum : {
            values : ["DEBIT", "CREDIT"],
            message : "Ledger type can be DEBIT or CREDIT",
        },
        required : [true, "Ledger type is required"],
        immutable : true,
    }

})


function preventLedgerModification(){
    throw new Error("Ledger entries cannot be modified after creation");
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('updateMany', preventLedgerModification);
ledgerSchema.pre('findOneAndDelete', preventLedgerModification);
ledgerSchema.pre('findOneAndReplace', preventLedgerModification);

const ledgerModel = mongoose.model("ledger", ledgerSchema);

module.exports = ledgerModel;
