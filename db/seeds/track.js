// /** Seeder to have initial data for users
//  * @module seeders/tracks
//  * @requires express
//  */

//const express = require('express')
/**
 * express module
 * Track model from the database
 * @const
 */
const Track = require('../../models/trackModel')
/**
 * express module
 * Album model from the database
 * @const
 */
const Album = require('../../models/albumModel')
/**
 * express module
 * User model from the database
 * @const
 */
const User = require('../../models/userModel')

// const app = express()
//const app = require('./../../app')
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
  createTracks()
})

db.on('error', err => {
  console.error('connection error:', err)
})

/**
 * A function that is used to create inital seed of tracks
 *
 * @memberof module:seeders/tracks
 *
 */
createTracks = async () => {
  let user1 = User.find({ name: 'Imagine Dragons' }).select('_id')
  user1 = (await user1).toString()
  let start = user1.indexOf(':')
  const user1Id = user1.substring(start + 2, start + 26)

  let user2 = User.find({ name: 'Ed Sheeran' }).select('_id')
  user2 = (await user2).toString()
  start = user2.indexOf(':')
  const user2Id = user2.substring(start + 2, start + 26)

  let user3 = User.find({ name: 'Amr Diab' }).select('_id')
  user3 = (await user3).toString()
  start = user3.indexOf(':')
  const user3Id = user3.substring(start + 2, start + 26)

  let user4 = User.find({ name: '21 Pilots' }).select('_id')
  user4 = (await user4).toString()
  start = user4.indexOf(':')
  const user4Id = user4.substring(start + 2, start + 26)

  let album1 = Album.find({ name: 'Evolve' }).select('_id')
  album1 = (await album1).toString()
  start = album1.indexOf(':')
  const album1Id = album1.substring(start + 2, start + 26)

  let album2 = Album.find({ name: 'Divide' }).select('_id')
  album2 = (await album2).toString()
  start = album2.indexOf(':')
  const album2Id = album2.substring(start + 2, start + 26)

  let album3 = Album.find({ name: 'Sahran' }).select('_id')
  album3 = (await album3).toString()
  start = album3.indexOf(':')
  const album3Id = album3.substring(start + 2, start + 26)

  let album4 = Album.find({ name: 'Blurry Face' }).select('_id')
  album4 = (await album4).toString()
  start = album4.indexOf(':')
  const album4Id = album4.substring(start + 2, start + 26)

  const track1 = new Track({
    name: 'Believer',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 1,
    durationMs: 204000,
    popularity: 12000000,
    album: album1Id,
    artists: user1Id,
    audioFilePath: 'tracks/track1.mp3'
  })
  await track1.save()
  await track1.updateOne({ href: `${process.env.API_URL}/tracks/${track1._id}` })
  await track1.updateOne({ uri: `spotify:tracks:${track1._id}` })

  const track2 = new Track({
    name: 'Thunder',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 2,
    durationMs: 187000,
    popularity: 300000,
    album: album1Id,
    artists: user1Id,
    audioFilePath: 'tracks/track2.mp3'

  })
  await track2.save()
  await track2.updateOne({ href: `${process.env.API_URL}/tracks/${track2._id}` })
  await track2.updateOne({ uri: `spotify:tracks:${track2._id}` })

  const track3 = new Track({
    name: 'Youm Talat',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 1,
    durationMs: 212000,
    popularity: 200000,
    album: album3Id,
    artists: user3Id,
    audioFilePath: 'tracks/track3.mp3'

  })
  await track3.save()
  await track3.updateOne({ href: `${process.env.API_URL}/tracks/${track3._id}` })
  await track3.updateOne({ uri: `spotify:tracks:${track3._id}` })

  const track4 = new Track({
    name: 'Odam Merayetha',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 2,
    durationMs: 222000,
    popularity: 200000,
    album: album3Id,
    artists: user3Id,
    audioFilePath: 'tracks/track4.mp3'

  })
  await track4.save()
  await track4.updateOne({ href: `${process.env.API_URL}/tracks/${track4._id}` })
  await track4.updateOne({ uri: `spotify:tracks:${track4._id}` })

  const track5 = new Track({
    name: 'Perfect',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 1,
    durationMs: 180000,
    popularity: 500000,
    album: album2Id,
    artists: user2Id,
    audioFilePath: 'tracks/track5.mp3'
  })
  await track5.save()
  await track5.updateOne({ href: `${process.env.API_URL}/tracks/${track5._id}` })
  await track5.updateOne({ uri: `spotify:tracks:${track5._id}` })

  const track6 = new Track({
    name: 'Stressed Out',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 1,
    durationMs: 202000,
    popularity: 300000,
    album: album4Id,
    artists: user4Id,
    audioFilePath: 'tracks/track6.mp3'
  })
  await track6.save()
  await track6.updateOne({ href: `${process.env.API_URL}/tracks/${track6._id}` })
  await track6.updateOne({ uri: `spotify:tracks:${track6._id}` })

  const track7 = new Track({
    name: 'Ride',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 2,
    durationMs: 214000,
    popularity: 600000,
    album: album4Id,
    artists: user4Id,
    audioFilePath: 'tracks/track7.mp3'
  })
  await track7.save()
  await track7.updateOne({ href: `${process.env.API_URL}/tracks/${track7._id}` })
  await track7.updateOne({ uri: `spotify:tracks:${track7._id}` })
  process.exit()
}
