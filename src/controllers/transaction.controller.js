const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const accountModel = require("../models/account.model");
const mongoose = require("mongoose");


/**
 * Creating a new transaction : 
 * The 10-step TRANSFER FLOW : 
 * 1. Validate request
 * 2. Validate idempotency keys
 * 3. Check account status
 * 4. Derive sender balance from ledger 
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notification
 */
async function CreateTransactionController(req, res){
    /*
    1. Validate request
    */ 
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if(!fromAccount || !toAccount || !amount || !idempotencyKey ){
        return res.status(400).json({
            message : "Missing required fields: fromAccount, toAccount, amount, idempotencyKey"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id : fromAccount,
    })

    const toUserAccount = await accountModel.findOne({
        _id : toAccount,
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message : "Invalid fromAccount or toAccount"
        })
    }
/**
 * 2. Validate idempotency keys
 */
    const transactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey : idempotencyKey,
    })

    if(transactionAlreadyExists){
        return res.status(200).json({
            message : "Transaction already proceeded",
            transaction : transactionAlreadyExists,
        })
    }

    if(transactionAlreadyExists){
        if(transactionAlreadyExists.status === 'COMPLETED' ){
            res.status(200).json({
                message : "Transaction already proceeded",
                transaction : transactionAlreadyExists,
            })
        }
    }

    if(transactionAlreadyExists){
        if(transactionAlreadyExists.status === 'PENDING'){
            res.status(200).json({
                message : "Transaction is pending, please wait for it to complete",
                transaction : transactionAlreadyExists,
            })
        }
    }

    if(transactionAlreadyExists){
        if(transactionAlreadyExists.status === 'FAILED'){
            res.status(500).json({
              message : "Transaction processing failed, please try again"
            })
        }
    }

    if(transactionAlreadyExists){
        if(transactionAlreadyExists.status === 'REVERSED'){
            res.status(500).json({
                messsage : "Transaction was reversed, please try again"
            })
        }
    }

    /*
    check account status
    */ 

    if(fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE'){
        return res.status(400).json({
            message : "Both accounts must be active to proceed with the transaction"
        })
    }

    /*
    4. Derive sender balance from ledger 
    */

    const balance = await fromUserAccount.getBalance();

    if(balance < amount){
        return res.status(400).json({
            message :` Insufficient balance in sender account. Current balance is ${balance}, Requested balance is ${amount}`
        })
    }

    /*
    5. Create transaction (PENDING)
    */ 
   let transaction;
    try{
        const session = await mongoose.startSession()
        session.startTransaction(); // a session is a context that groups multiple database operations together.
        // The use of startTransaction and session allows us to group multiple database operations into a single unit of work.
        //  If any operation within the transaction fails, we can roll back all changes made during the transaction, 
        // ensuring data integrity and consistency.
         transaction = ( await transactionModel.create([{
             fromAccount,
             toAccount,
             amount,
             idempotencyKey,
             status : "PENDING",
         }], { session }) )[0] // create returns an array of created documents, we need to access the first element to get the transaction document
     
         const debitLedgerEntry = await ledgerModel.create([{
             account : fromAccount,
             amount : amount,
             transaction : transaction._id,
             type : 'DEBIT',
         }] ,{session})
     
         const creditLedgerEntry = await ledgerModel.create([{
             account : toAccount,
             amount : amount,
             transaction : transaction._id,
             type : 'CREDIT',
         }], { session })
     
         await transactionModel.findOneAndUpdate(
             { _id : transaction._id },
             { status : "COMPLETED" },
             { session }
         )
     
         await session.commitTransaction()
         session.endSession();
    }catch(error){
        await transactionModel.findOneAndUpdate(
            { idempotencyKey : idempotencykey },
            { status : "FAILED" }
        )
        return res.status(500).json({
            message : "Transaction failed due to internal error",
            error : error.message,
        })
    }
 

    /*
    10. Send email notification
    */
   await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)

   return res.status(201).json({
    message : "Transaction completed successfully",
    transaction: transaction,
   })
}

async function createInitialFundsTransaction(req, res){
   const { toAccount, amount, idempotencyKey } = req.body;

   if(!toAccount || !amount || !idempotencyKey){
    return res.status(400).json({
        message : "toAccount, amount and idempotencyKey are required"})
    }

    const toUserAccount = await accountModel.findOne({
        _id : toAccount,
    })

    if(!toUserAccount){
        return res.status(400).json({
            message : "Invalid toAccount"
        })
    }

    // look in the middlware, we are attaching the user 
        // to the request object, so we can use it here to 
        // find the system account associated with the 
        // user who is making the request
        // this is to ensure that only system users can create initial funds transactions, 
        // and they can only create initial funds transactions for their own system account

    const fromUserAccount = await accountModel.findOne({
        user : req.user._id, 
    })
    if(!fromUserAccount){
        return res.status(400).json({
            message : "System account not found for the user"
        })
    }

    const session = await mongoose.startSession();
    session.startTransaction();
// whenever we use 'session', we need to pass the data in the form of an array

    const transaction = new transactionModel({
        fromAccount : fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status : "PENDING",
    })

    const creditLedgerEntry = await ledgerModel.create([{
        account : toAccount,
        amount : amount,
        transaction : transaction._id,
        type : "CREDIT",
    }], { session })

    const debitLedgerEntry = await ledgerModel.create([{
        account : fromUserAccount._id,
        amount : amount,
        transaction : transaction._id,
        type : "DEBIT",
    }], { session })

    transaction.status = "COMPLETED";
    await transaction.save({ session })

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
        message : "Initial funds transaction created successfully",
        transaction : transaction,
    })
}

module.exports = {
        CreateTransactionController,
        createInitialFundsTransaction
}

