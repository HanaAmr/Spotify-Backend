const express = require('express');
const userRoute = require('./routes/users');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

var app = express();
app.use(express.json());

app.use('/', userRoute);

//after all handeled routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

//handled undefined routes
app.use(errorController);

module.exports = app;