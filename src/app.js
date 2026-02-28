// Creating server`s instance
// Configuring the server { no. of middlewares we are using,
//  the types of api`s we are going to use etc. }

// although we will not start the server in this file, we will export 
// the app instance to the server file and start the server there

const express = require('express');
const app = express();
const authRouter = require('./routes/auth.routes');
const cookieParser = require("cookie-parser");

app.use(express.json()); // for parsing application/json
app.use(cookieParser()); // for parsing cookies
app.use('/api/auth', authRouter);

module.exports = app;