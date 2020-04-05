

const dotenv = require('dotenv') //  we write the cofigurations we need i.e. the environment variables in config.env file
dotenv.config({ path: '.env' }) // set the path of the config property of dotenv to the file created
const app = require('./app')
const mongoose = require('mongoose')

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...')
  console.log(err.name, err.message)
  process.exit(1)
})

 //    download mongoose and put it in config
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => {
    //console.log(con.connections);
    console.log('DB is connected successfuly!')
})



const server = app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}`);
})


process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION!  Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

