const express = require('express');
const userRoute = require('./routes/userRoute');

var app = express();
app.use(express.json());

app.use('/', userRoute);


module.exports = app;