/** Seeder to have seed data for player
 * @module seeders/player
 * @requires express
 */

/**
 * Context seeder to call to fill database.
 * @type {object}
 * @const
 */

/**
 * express module
 * Player model from the database
 * @const
 */
const Player = require('../../models/playerModel')


/**
 * User model from the database
 * @const
 */
const User = require('../../models/userModel')

/**
 * express module
 * dotenv to access environment constants
 * @const
 */
const dotenv = require('dotenv')
/**
 * express module
 * Mongoose to access and change the database
 * @const
 */
const mongoose = require('mongoose')


// Configuring environment variables to use them
dotenv.config({ path: '../../.env' })
const mongoDB = process.env.DATABASE_LOCAL
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.once('open', url => {
  console.log('Database connected')
  createPlayers()
})

db.on('error', err => {
  console.error('connection error:', err)
})

/**
 * A function that is used to create inital seed of contexts
 *
 * @memberof module:seeders/context~contextSeeder
 *
 */
createPlayers = async () => {


    let user1= await User.find({'name':'Imagine Dragons'})
    let user2= await User.find({'name':'Ed Sheeran'})
    let user3= await User.find({'name':'Amr Diab'})
    let user4= await User.find({'name':'21 Pilots'})
    let user5= await User.find({'name':'Omar'})
    let user6= await User.find({'name':'Ahmed'})
    let user7= await User.find({'name':'Hana'})
    let user8= await User.find({'name':'Nada'})


  const player1 = new Player({
    userId: user1[0]._id
  })
  await player1.save()

  const player2 = new Player({
    userId: user2[0]._id
  })
  await player2.save()

  const player3 = new Player({
    userId: user3[0]._id
  })
  await player3.save()

  const player4 = new Player({
    userId: user4[0]._id
  })
  await player4.save()

  const player5 = new Player({
    userId: user5[0]._id
  })
  await player5.save()

  const player6 = new Player({
    userId: user6[0]._id
  })
  await player6.save()

  const player7 = new Player({
    userId: user7[0]._id
  })
  await player7.save()

  const player8 = new Player({
    userId: user8[0]._id
  })
  await player8.save()
  
  process.exit()
  
}
