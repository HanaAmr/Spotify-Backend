//This file should include the names of the routes to be requested
const express = require('express');
const userRoute = require('./routes/userRoute');

var app = express();

app.use('/', userRoute);

module.exports = app;