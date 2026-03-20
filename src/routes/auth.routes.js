const express = require("express");

const authController  = require('../controllers/auth.controller.js');

const router = express.Router();

// POST /api/auth/register
router.post("/register", authController.RegisterController);

// POST /api/auth/login
router.post('/login', authController.LoginController);

/**
 *  - User Logout Controller
 *  - POST /api/auth/logout
 */
router.post('/logout', authController.LogoutController);

module.exports = router;