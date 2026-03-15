const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const accountModel = require("../models/account.model");


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
            message : "Transaction  already proceeded",
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

    
     
}

modules.exports = {
        CreateTransactionController,
}

