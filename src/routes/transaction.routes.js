const {  Router } = require('express');
const authMiddleware = require("../middlewares/auth.middleware.js");
const transactionController = require("../controllers/transaction.controller.js");
const transactionRoutes = Router();


/*
- POST /api/transactions
- Create a new transaction between two accounts. The request body should include the source account ID,
 destination account ID, amount, and an idempotency key to prevent duplicate transactions. 
 The response should include the transaction details and its status (PENDING, COMPLETED, or FAILED)
*/
transactionRoutes.post("/", authMiddleware.authMiddleware, transactionController.CreateTransactionController);

transactionRoutes.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction);

module.exports = transactionRoutes;

