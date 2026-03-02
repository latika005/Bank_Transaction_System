const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js");
const accountController = require("../controllers/account.controller.js");
const router = express.Router();

/* 
 - POST /api/accounts/
 - Create a new account
 - Protected route
*/

router.post("/", authMiddleware.authMiddleware, accountController.createAccountController);

module.exports = router;  