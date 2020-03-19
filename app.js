const express = require('express');

const usersRouter = require('./routes/users');
const artistRouter=require('./routes/artistRouters')

const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

const app = express();
app.use(express.json());

//Routers
app.use('/', usersRouter);
app.use('/Artists',artistRouter)

//Middlewares
//after all handeled routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})
//handled undefined routes
app.use(errorController);

module.exports = app;