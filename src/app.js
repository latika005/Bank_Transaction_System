// Creating server`s instance
// Configuring the server { no. of middlewares we are using,
//  the types of api`s we are going to use etc. }

// although we will not start the server in this file, we will export 
// the app instance to the server file and start the server there

const express = require('express');
const app = express();
app.use(express.json());      // for parsing application/json








const cookieParser = require("cookie-parser");
app.use(cookieParser()); // for parsing cookies

// Routes required
const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');

// Use Routes
app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);

module.exports = app;