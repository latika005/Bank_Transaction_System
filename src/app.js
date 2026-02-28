// Creating server`s instance
// Configuring the server { no. of middlewares we are using,
//  the types of api`s we are going to use etc. }

// although we will not start the server in this file, we will export 
// the app instance to the server file and start the server there

const express = require('express');

const app = express();

module.exports = app;