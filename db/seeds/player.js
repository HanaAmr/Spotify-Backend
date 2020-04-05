/** Seeder to have initial data for player
 * @module seeders/player
 * @requires express
 */

/**
 * Context seeder to call to fill initial database.
 * @type {object}
 * @const
 */

const express = require('express')
/**
 * express module
 * Category model from the database
 * @const
 */
const Context = require('../../models/contextModel')

/**
 * express module
 * Playlist model from the database
 * @const
 */
const Playlist = require('../../models/playlistModel')

/**
 * express module
 * Album model from the database
 * @const
 */
const Album = require('../../models/albumModel')

/**
 * express module
 * Player model from the database
 * @const
 */
const Player = require('../../models/playerModel')


/**
 * express module
 * Artist model from the database
 * @const
 */
const User = require('../../models/userModel')

const app = require('./../../app')
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

  
}
