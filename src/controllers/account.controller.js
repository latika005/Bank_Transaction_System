const AccountModel = require("../models/account.model.js");

async function createAccountController(req, res){
    const user = req.user;

    const account = await AccountModel.create({
        user : user._id,
    })

    res.status(201).json({
        message : "Account created successfully",
        account
    })
}

async function getUserAccountsController(req, res){

    const accounts = await AccountModel.find({
        user : req.user._id
    });

    res.status(200).json({  
        message : "User accounts retrieved successfully",
        accounts
    })
}

async function getAccountBalanceController(req, res){
    const { accountId } = req.params;

    const account = await AccountModel.findOne({
        _id : accountId, 
        user : req.user._id
    }) // to make sure the user can only access their own accounts
       // the two fields are necessary to avoid unauthorized access to other users' accounts

    if(!account){
        return res.status(404).json({
            message : "Account not found"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        // message : "Account balance retrieved successfully",
        accountId : account._id,
        balance : balance
    })
}


module.exports = {
      createAccountController,
      getUserAccountsController,
      getAccountBalanceController
}