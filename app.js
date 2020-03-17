const express = require('express');
const usersRouter = require('./routes/users');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

const app = express();
app.use(express.json());

app.use('/', usersRouter);

//after all handeled routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

//handled undefined routes
app.use(errorController);


// //This file should include the names of the routes to be requested
// const dotenv = require('dotenv')
// const mongoose= require('mongoose')

// dotenv.config()
// const mongoDB = process.env.MONGO_URI
// mongoose.connect(mongoDB, { useNewUrlParser : true, useUnifiedTopology : true})

// const db = mongoose.connection
// db.once('open', url => {
//     console.log('Database connected')
//   })
  
//   db.on('error', err => {
//     console.error('connection error:', err)
//   })

module.exports = app;