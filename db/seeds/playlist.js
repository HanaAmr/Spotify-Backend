/** Seeder to have initial data for users
 * @module seeders/playlists
 * @requires express
 */

// const express = require('express')
/**
 * express module
 * Category model from the database
 * @const
 */
const Playlist = require('../../models/playlistModel')
const Track = require('../../models/trackModel')
const User = require('../../models/userModel')
const Category = require('../../models/categoryModel')
// const app = express()
// const app = require('./../../app')
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
  createPlaylists()
})

db.on('error', err => {
  console.error('connection error:', err)
})

/**
 * A function that is used to create inital seed of users
 *
 * @memberof module:seeders/playlists
 *
 */
createPlaylists = async () => {
  let category1 = Category.find({ name: 'Jazz' }).select('_id')
  category1 = (await category1).toString()
  let start = category1.indexOf(':')
  const category1Id = category1.substring(start + 2, start + 26)

  let category2 = Category.find({ name: 'Happy' }).select('_id')
  category2 = (await category2).toString()
  start = category2.indexOf(':')
  const category2Id = category2.substring(start + 2, start + 26)

  let category3 = Category.find({ name: 'Arabic' }).select('_id')
  category3 = (await category3).toString()
  start = category3.indexOf(':')
  const category3Id = category3.substring(start + 2, start + 26)

  let category4 = Category.find({ name: 'Pop' }).select('_id')
  category4 = (await category4).toString()
  start = category4.indexOf(':')
  const category4Id = category4.substring(start + 2, start + 26)

  let user1 = User.find({ name: 'Imagine Dragons' }).select('_id')
  user1 = (await user1).toString()
  start = user1.indexOf(':')
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

  let user7 = User.find({ name: 'Hana' }).select('_id')
  user7 = (await user7).toString()
  start = user7.indexOf(':')
  const user7Id = user7.substring(start + 2, start + 26)

  let user6 = User.find({ name: 'Omar' }).select('_id')
  user6 = (await user6).toString()
  start = user6.indexOf(':')
  const user6Id = user6.substring(start + 2, start + 26)

  let user8 = User.find({ name: 'Nada' }).select('_id')
  user8 = (await user8).toString()
  start = user8.indexOf(':')
  const user8Id = user8.substring(start + 2, start + 26)

  let track1 = Track.find({ name: 'Believer' }).select('_id')
  track1 = (await track1).toString()
  start = track1.indexOf(':')
  const track1Id = track1.substring(start + 2, start + 26)

  let track2 = Track.find({ name: 'Thunder' }).select('_id')
  track2 = (await track2).toString()
  start = track2.indexOf(':')
  const track2Id = track2.substring(start + 2, start + 26)

  let track3 = Track.find({ name: 'Youm Talat' }).select('_id')
  track3 = (await track3).toString()
  start = track3.indexOf(':')
  const track3Id = track3.substring(start + 2, start + 26)

  let track4 = Track.find({ name: 'Odam Merayetha' }).select('_id')
  track4 = (await track4).toString()
  start = track4.indexOf(':')
  const track4Id = track4.substring(start + 2, start + 26)

  let track5 = Track.find({ name: 'Perfect' }).select('_id')
  track5 = (await track5).toString()
  start = track5.indexOf(':')
  const track5Id = track5.substring(start + 2, start + 26)

  let track6 = Track.find({ name: 'Stressed Out' }).select('_id')
  track6 = (await track6).toString()
  start = track6.indexOf(':')
  const track6Id = track6.substring(start + 2, start + 26)

  let track7 = Track.find({ name: 'Ride' }).select('_id')
  track7 = (await track7).toString()
  start = track7.indexOf(':')
  const track7Id = track7.substring(start + 2, start + 26)

  let track8 = Track.find({ name: 'Thinking Out Loud' }).select('_id')
  track8 = (await track8).toString()
  start = track8.indexOf(':')
  const track8Id = track8.substring(start + 2, start + 26)

  const playlist1 = new Playlist({
    name: 'Imagine Dragons Radio',
    collaborative: false,
    externalUrl: 'this should be an externalUrl',
    images: [`${process.env.API_URL}/public/imgs/playlists/Imagine_Dragons.jpg`],
    description: 'Imagine Dragons',
    owner: user1Id,
    public: true,
    snapshot_id: '5e729e8b3d8d0a432c70b59d',
    type: 'playlist',
    popularity: 24000000,
    noOfFollowers: 2000000,
    trackObjects: [track1Id, track2Id],
    category: category1Id,
    createdAt: Date.now()
  })
  await playlist1.save()
  await playlist1.updateOne({ href: `${process.env.API_URL}/playlists/${playlist1._id}` })
  await playlist1.updateOne({ tracks: { href: `${process.env.API_URL}/playlists/${playlist1._id}/tracks`, total: 2 } })
  await playlist1.updateOne({ uri: `spotify:playlists:${playlist1._id}` })

  const playlist2 = new Playlist({
    name: 'Happy Hits',
    collaborative: false,
    externalUrl: 'this should be an externalUrl',
    images: [`${process.env.API_URL}/public/imgs/playlists/Happy_Hits.jpg`],
    description: 'Ed Sheeran,Imagine Dragons',
    owner: user2Id,
    public: true,
    snapshot_id: '5e729e8b3d8d0a432c70b59d',
    type: 'playlist',
    popularity: 2000000,
    noOfFollowers: 8000000,
    trackObjects: [track5Id, track3Id],
    category: category2Id,
    createdAt: Date.now()
  })
  await playlist2.save()
  await playlist2.updateOne({ href: `${process.env.API_URL}/playlists/${playlist2._id}` })
  await playlist2.updateOne({ tracks: { href: `${process.env.API_URL}/playlists/${playlist2._id}/tracks`, total: 2 } })
  await playlist2.updateOne({ uri: `spotify:playlists:${playlist2._id}` })

  const playlist3 = new Playlist({
    name: 'Chill Bel Masry',
    collaborative: false,
    externalUrl: 'this should be an externalUrl',
    images: [`${process.env.API_URL}/public/imgs/playlists/Chill_Bel_Masry.jpg`],
    description: 'Amr Diab',
    owner: user3Id,
    public: true,
    snapshot_id: '5e729e8b3d8d0a432c70b59d',
    type: 'playlist',
    popularity: 50000000,
    noOfFollowers: 9000000,
    trackObjects: [track3Id, track4Id],
    category: category3Id,
    createdAt: Date.now()
  })
  await playlist3.save()
  await playlist3.updateOne({ href: `${process.env.API_URL}/playlists/${playlist3._id}` })
  await playlist3.updateOne({ tracks: { href: `${process.env.API_URL}/playlists/${playlist3._id}/tracks`, total: 1 } })
  await playlist3.updateOne({ uri: `spotify:playlists:${playlist3._id}` })

  const playlist4 = new Playlist({
    name: 'Best of 21 Pilots',
    collaborative: false,
    externalUrl: 'this should be an externalUrl',
    images: [`${process.env.API_URL}/public/imgs/playlists/Best_of_21_Pilots.jpg`],
    description: '21 Pilots',
    owner: user4Id,
    public: true,
    snapshot_id: '5e729e8b3d8d0a432c70b59d',
    type: 'playlist',
    popularity: 20000000,
    noOfFollowers: 7000000,
    trackObjects: [track6Id, track7Id],
    category: category4Id,
    createdAt: Date.now()
  })
  await playlist4.save()
  await playlist4.updateOne({ href: `${process.env.API_URL}/playlists/${playlist4._id}` })
  await playlist4.updateOne({ tracks: { href: `${process.env.API_URL}/playlists/${playlist4._id}/tracks`, total: 3 } })
  await playlist4.updateOne({ uri: `spotify:playlists:${playlist4._id}` })

  const playlist5 = new Playlist({
    name: 'Mood Booster',
    collaborative: false,
    externalUrl: 'this should be an externalUrl',
    images: [`${process.env.API_URL}/public/imgs/playlists/Mood_Booster.jpg`],
    description: 'Ed Sheeran',
    owner: user2Id,
    public: true,
    snapshot_id: '5e729e8b3d8d0a432c70b595',
    type: 'playlist',
    popularity: 10000000,
    noOfFollowers: 3000000,
    trackObjects: [track8Id],
    category: category2Id,
    createdAt: Date.now()
  })
  await playlist5.save()
  await playlist5.updateOne({ href: `${process.env.API_URL}/playlists/${playlist5._id}` })
  await playlist5.updateOne({ tracks: { href: `${process.env.API_URL}/playlists/${playlist5._id}/tracks`, total: 1 } })
  await playlist5.updateOne({ uri: `spotify:playlists:${playlist5._id}` })

  const playlist6 = new Playlist({
    name: 'Happy Beats',
    collaborative: false,
    externalUrl: 'this should be an externalUrl',
    images: [`${process.env.API_URL}/public/imgs/playlists/Happy_Beats.jpg`],
    description: 'Ed Sheeran',
    owner: user7Id,
    public: true,
    snapshot_id: '5e729e8b3d8d0a432c70b595',
    type: 'playlist',
    popularity: 90000000,
    noOfFollowers: 6000000,
    trackObjects: [track8Id, track5Id],
    category: category4Id,
    createdAt: Date.now()
  })
  await playlist6.save()
  await playlist6.updateOne({ href: `${process.env.API_URL}/playlists/${playlist6._id}` })
  await playlist6.updateOne({ tracks: { href: `${process.env.API_URL}/playlists/${playlist6._id}/tracks`, total: 2 } })
  await playlist6.updateOne({ uri: `spotify:playlists:${playlist6._id}` })

  const playlist7 = new Playlist({
    name: 'Good Vibes',
    collaborative: false,
    externalUrl: 'this should be an externalUrl',
    images: [`${process.env.API_URL}/public/imgs/playlists/Good_Vibes.jpg`],
    description: 'Imagine Dragons',
    owner: user8Id,
    public: true,
    snapshot_id: '5e729e8b3d8d0a432c70b595',
    type: 'playlist',
    popularity: 50000000,
    noOfFollowers: 3000000,
    trackObjects: [track2Id],
    category: category4Id,
    createdAt: Date.now()
  })
  await playlist7.save()
  await playlist7.updateOne({ href: `${process.env.API_URL}/playlists/${playlist7._id}` })
  await playlist7.updateOne({ tracks: { href: `${process.env.API_URL}/playlists/${playlist7._id}/tracks`, total: 1 } })
  await playlist7.updateOne({ uri: `spotify:playlists:${playlist7._id}` })

  const playlist8 = new Playlist({
    name: 'Feeling Good',
    collaborative: false,
    externalUrl: 'this should be an externalUrl',
    images: [`${process.env.API_URL}/public/imgs/playlists/Feeling_Good.jpg`],
    description: '21 Pilots, Ed Sheeran',
    owner: user8Id,
    public: true,
    snapshot_id: '5e729e8b3d8d0a432c70b595',
    type: 'playlist',
    popularity: 40000000,
    noOfFollowers: 9000000,
    trackObjects: [track7Id, track8Id],
    category: category1Id,
    createdAt: Date.now()
  })
  await playlist8.save()
  await playlist8.updateOne({ href: `${process.env.API_URL}/playlists/${playlist8._id}` })
  await playlist8.updateOne({ tracks: { href: `${process.env.API_URL}/playlists/${playlist8._id}/tracks`, total: 2 } })
  await playlist8.updateOne({ uri: `spotify:playlists:${playlist8._id}` })

  const playlist9 = new Playlist({
    name: 'Lo-Fi Beats',
    collaborative: false,
    externalUrl: 'this should be an externalUrl',
    images: [`${process.env.API_URL}/public/imgs/playlists/Lo-Fi_Beats.jpg`],
    description: '21 Pilots, Imagine_Dragons',
    owner: user6Id,
    public: true,
    snapshot_id: '5e729e8b3d8d0a432c70b595',
    type: 'playlist',
    popularity: 80000000,
    noOfFollowers: 1000000,
    trackObjects: [track6Id, track7Id, track2Id],
    category: category1Id,
    createdAt: Date.now()
  })
  await playlist9.save()
  await playlist9.updateOne({ href: `${process.env.API_URL}/playlists/${playlist9._id}` })
  await playlist9.updateOne({ tracks: { href: `${process.env.API_URL}/playlists/${playlist9._id}/tracks`, total: 3 } })
  await playlist9.updateOne({ uri: `spotify:playlists:${playlist9._id}` })

  process.exit()
}
