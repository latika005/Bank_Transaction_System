const {  Router } = require('express');
const authMiddleware = require("../middleware/auth.middleware.js");
const transactionRoutes = Router();


/*
- POST /api/transactions
- Create a new transaction between two accounts. The request body should include the source account ID,
 destination account ID, amount, and an idempotency key to prevent duplicate transactions. 
 The response should include the transaction details and its status (PENDING, COMPLETED, or FAILED)
*/
transactionRoutes.post("/", authMiddleware.authMiddleware)

module.exports = transactionRoutes;

