/** Seeder to have initial data for playHistories
 * @module seeders/playlist
 * @requires express
 */

/**
 * playHistory seeder to call to fill initial database.
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
 * Play history model from the database
 * @const
 */
const playHistory = require('../../models/playHistoryModel')

/**
 * express module
 * Album model from the database
 * @const
 */
const Album = require('../../models/albumModel')
/**
 * express module
 * Track model from the database
 * @const
 */
const Track = require('../../models/trackModel')
/**
 * express module
 * User model from the database
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
  createPlayHistories()
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
createPlayHistories = async () => {


    let user1= await User.find({'name':'Imagine Dragons'})
    let user2= await User.find({'name':'Ed Sheeran'})
    let user3= await User.find({'name':'Amr Diab'})
    let user4= await User.find({'name':'21 Pilots'})


    let track1 = await Track.find({'name':'Believer'})
    let track3 = await Track.find({'name':'Youm Talat'})
    let track5 = await Track.find({'name':'Perfect'})

    let context = await Context.find()

  const playHistory1 = new playHistory({
    userId: user1[0]._id,
    context: context[0]._id,
    playedAt: Date.now(),
    track: track1[0]._id
  })
  await playHistory1.save()
  await context[1].updateOne({playHistoryId:playHistory1._id})


  const playHistory2 = new playHistory({
    userId: user2[0]._id,
    context: context[2]._id,
    playedAt: Date.now(),
    track: track5[0]._id
  })
  await playHistory2.save()
  await context[2].updateOne({playHistoryId:playHistory2._id})

  const playHistory3 = new playHistory({
    userId: user3[0]._id,
    context: context[3]._id,
    playedAt: Date.now(),
    track: track3[0]._id
  })
  await playHistory3.save()
  await context[3].updateOne({playHistoryId:playHistory3._id})
  
  const playHistory4 = new playHistory({
    userId: user2[0]._id,
    context: context[4]._id,
    playedAt: Date.now(),
    track: track5[0]._id
  })
  await playHistory4.save()
  await context[4].updateOne({playHistoryId:playHistory4._id})


  const playHistory5 = new playHistory({
    userId: user4[0]._id,
    context: context[5]._id,
    playedAt: Date.now(),
    track: track6[0]._id
  })
  await playHistory5.save()
  await context[5].updateOne({playHistoryId:playHistory5._id})


}
