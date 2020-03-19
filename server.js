const dotenv = require('dotenv') //  we write the cofigurations we need i.e. the environment variables in config.env file
dotenv.config({ path: './config.env' }) // set the path of the config property of dotenv to the file created

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  process.exit(1)
})

const mongoose = require('mongoose') //    download mongoose and put it in config
mongoose.connect(process.env.DATABASE_LOCAL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => {
  console.log('Connection is successful')
})

const app = require('./app')

const server = app.listen(process.env.PORT, () => {
  console.log('Running Server..')
})

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION!  Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

/// images in album or playlist will they be hrefs or what

/// check category id ---> is it neccessary

/// Notes: playlist/id/tracks and albums/id/tracks are now meaningless sice the tracks attribute in the the album or playlist will now be enough
