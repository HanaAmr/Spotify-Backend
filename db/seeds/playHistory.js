/** Seeder to seed data for playHistories
 * @module seeders/playlist
 * @requires express
 */

/**
 * playHistory seeder to call to fill database.
 * @type {object}
 * @const
 */

/**
 * Category model from the database
 * @const
 */
const Context = require('../../models/contextModel')

/**
 * Play history model from the database
 * @const
 */
const playHistory = require('../../models/playHistoryModel')

/**
 * Album model from the database
 * @const
 */
const Album = require('../../models/albumModel')
/**
 * Playlist model from the database
 * @const
 */
const Playlist = require('../../models/playlistModel')
/**
 * Track model from the database
 * @const
 */
const Track = require('../../models/trackModel')
/**
 * User model from the database
 * @const
 */
const User = require('../../models/userModel')

/**
 * dotenv to access environment constants
 * @const
 */
const dotenv = require('dotenv')
/**
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
  // Seeding context first. *Note: can't seed in seperate file as we will lose the contexts we created as it can't exist on it's own*

  // Data needed to seed
  const user1 = await User.find({ name: 'Imagine Dragons' })
  const user2 = await User.find({ name: 'Ed Sheeran' })
  const user3 = await User.find({ name: 'Amr Diab' })
  const user4 = await User.find({ name: '21 Pilots' })
  const user5 = await User.find({ name: 'Omar' })
  const user6 = await User.find({ name: 'Ahmed' })
  const user7 = await User.find({ name: 'Hana' })
  const user8 = await User.find({ name: 'Nada' })

  const playlist1 = await Playlist.find({ name: 'Imagine Dragons Radio' })
  const playlist2 = await Playlist.find({ name: 'Happy Hits' })
  const playlist3 = await Playlist.find({ name: 'Chill Bel Masry' })
  const playlist4 = await Playlist.find({ name: 'Best of 21 Pilots' })

  const album1 = await Album.find({ name: 'Evolve' }).select('_id')
  const album2 = await Album.find({ name: 'Divide' }).select('_id')
  const album3 = await Album.find({ name: 'Sahran' }).select('_id')
  const album4 = await Album.find({ name: 'Blurry Face' }).select('_id')

  const track1 = await Track.find({ name: 'Believer' })
  const track2 = await Track.find({ name: 'Youm Talat' })
  const track3 = await Track.find({ name: 'Perfect' })
  const track4 = await Track.find({ name: 'Stressed Out' })
  const track5 = await Track.find({ name: 'Ride' })

  const context1 = new Context({
    externalUrls: 'Should be an external url',
    href: 'Should be a href',
    type: 'playlist',
    name: playlist1[0].name,
    images: playlist1[0].images,
    followersCount: playlist1[0].noOfFollowers
  })
  await context1.save()
  await context1.updateOne({ href: `http://127.0.0.1:${process.env.PORT}/playlists/${playlist1[0]._id}` })
  await context1.updateOne({ uri: `spotify:playlists:${playlist1[0]._id}` })

  const context2 = new Context({
    externalUrls: 'Should be an external url',
    type: 'playlist',
    href: 'Should be a href',
    name: playlist2[0].name,
    images: playlist2[0].images,
    followersCount: playlist2[0].noOfFollowers
  })
  await context2.save()
  await context2.updateOne({ href: `http://127.0.0.1:${process.env.PORT}/playlists/${playlist2[0]._id}` })
  await context2.updateOne({ uri: `spotify:playlists:${playlist2[0]._id}` })

  const context3 = new Context({
    externalUrls: 'Should be an external url',
    type: 'playlist',
    href: 'Should be a href',
    name: playlist3[0].name,
    images: playlist3[0].images,
    followersCount: playlist3[0].noOfFollowers
  })
  await context3.save()
  await context3.updateOne({ href: `http://127.0.0.1:${process.env.PORT}/playlists/${playlist3[0]._id}` })
  await context3.updateOne({ uri: `spotify:playlists:${playlist3[0]._id}` })

  const context4 = new Context({
    externalUrls: 'Should be an external url',
    type: 'album',
    href: 'Should be a href',
    name: album1[0].name,
    images: album1[0].images,
    followersCount: album1[0].popularity
  })
  await context4.save()
  await context4.updateOne({ href: `http://127.0.0.1:${process.env.PORT}/albums/${album1[0]._id}` })
  await context4.updateOne({ uri: `spotify:albums:${album1[0]._id}` })

  const context5 = new Context({
    externalUrls: 'Should be an external url',
    type: 'album',
    href: 'Should be a href',
    name: album2[0].name,
    images: album2[0].images,
    followersCount: album2[0].popularity
  })
  await context5.save()
  await context5.updateOne({ href: `http://127.0.0.1:${process.env.PORT}/albums/${album2[0]._id}` })
  await context5.updateOne({ uri: `spotify:albums:${album2[0]._id}` })

  const context6 = new Context({
    externalUrls: 'Should be an external url',
    type: 'album',
    href: 'Should be a href',
    name: user1[0].name,
    images: user1[0].images,
    followersCount: user1[0].followers.length
  })
  await context6.save()
  await context6.updateOne({ href: `http://127.0.0.1:${process.env.PORT}/albums/${user1[0]._id}` })
  await context6.updateOne({ uri: `spotify:albums:${user1[0]._id}` })

  const context7 = new Context({
    externalUrls: 'Should be an external url',
    type: 'album',
    href: 'Should be a href',
    name: user2[0].name,
    images: user2[0].images,
    followersCount: user2[0].followers.length
  })
  await context7.save()
  await context7.updateOne({ href: `http://127.0.0.1:${process.env.PORT}/albums/${user2[0]._id}` })
  await context7.updateOne({ uri: `spotify:albums:${user2[0]._id}` })

  const playHistory1 = new playHistory({
    userId: user1[0]._id,
    context: context1._id,
    playedAt: Date.now(),
    track: track1[0]._id
  })
  await playHistory1.save()
  await context1.updateOne({ playHistoryId: playHistory1._id })

  const playHistory2 = new playHistory({
    userId: user2[0]._id,
    context: context2._id,
    playedAt: Date.now(),
    track: track5[0]._id
  })
  await playHistory2.save()
  await context2.updateOne({ playHistoryId: playHistory2._id })

  const playHistory3 = new playHistory({
    userId: user7[0]._id,
    context: context3._id,
    playedAt: Date.now(),
    track: track3[0]._id
  })
  await playHistory3.save()
  await context3.updateOne({ playHistoryId: playHistory3._id })

  const playHistory4 = new playHistory({
    userId: user2[0]._id,
    context: context4._id,
    playedAt: Date.now(),
    track: track2[0]._id
  })
  await playHistory4.save()
  await context4.updateOne({ playHistoryId: playHistory4._id })

  const playHistory5 = new playHistory({
    userId: user6[0]._id,
    context: context5._id,
    playedAt: Date.now(),
    track: track5[0]._id
  })
  await playHistory5.save()
  await context5.updateOne({ playHistoryId: playHistory5._id })

  const playHistory6 = new playHistory({
    userId: user5[0]._id,
    context: context6._id,
    playedAt: Date.now(),
    track: track1[0]._id
  })
  await playHistory6.save()
  await context6.updateOne({ playHistoryId: playHistory6._id })

  const playHistory7 = new playHistory({
    userId: user5[0]._id,
    context: context7._id,
    playedAt: Date.now(),
    track: track5[0]._id
  })
  await playHistory7.save()
  await context7.updateOne({ playHistoryId: playHistory7._id })
  process.exit()
}
