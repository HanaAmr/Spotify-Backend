//This file should include the names of the routes to be requested
const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose= require('mongoose')

const usersRouter = require('./routes/users')
const artistRouter=require('./routes/artistRouters')

dotenv.config()
const mongoDB = process.env.MONGO_URI
mongoose.connect(mongoDB, { useNewUrlParser : true, useUnifiedTopology : true})

const db = mongoose.connection
db.once('open', url => {
    console.log('Database connected')
  })
  
  db.on('error', err => {
    console.error('connection error:', err)
  })

app.use(express.json())
app.use('/', usersRouter)
app.use('/Artists',artistRouter)

module.exports = app;