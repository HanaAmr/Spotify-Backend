/** Seeder to have initial data for ads
 * @module seeders/ads
 * @requires express
 */

/**
 * Users seeder to call to fill initial database.
 * @type {object}
 * @const
 */

const express = require('express')
/**
 * express module
 * User model from the database
 * @const
 */
const User = require('../../models/userModel')
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
  createAds()
})

db.on('error', err => {
  console.error('connection error:', err)
})

/**
 * A function that is used to create inital seed of ads
 *
 * @memberof module:seeders/ads
 *
 */
createAds = async () => {
  const user1 = new User({
    name: 'CocaCola',
    email: 'CocaCola@email.com',
    password: 'password1',
    gender: 'male',
    dateOfBirth: '1999-1-10',
    role: 'artist',
    artistInfo: {
      popularity: 100000,
      genres: ['pop rock']
    }
  })
  await user1.save()
  await user1.updateOne({ href: `${process.env.API_URL}/users/${user1._id}` })
  await user1.updateOne({ uri: `spotify:users:${user1._id}` })

  const user2 = new User({
    name: 'Pepsi',
    email: 'Pepsi@email.com',
    password: 'password2',
    gender: 'male',
    dateOfBirth: '1998-2-15',
    role: 'artist',
    artistInfo: {
      popularity: 5000,
      genres: ['pop', 'pop rock']
    }
  })
  await user2.save()
  await user2.updateOne({ href: `${process.env.API_URL}/users/${user2._id}` })
  await user2.updateOne({ uri: `spotify:users:${user2._id}` })

  const user3 = new User({
    name: 'Yokohama Tires',
    email: 'Yokohama@email.com',
    password: 'password3',
    gender: 'male',
    dateOfBirth: '1952-1-8',
    role: 'artist',
    artistInfo: {
      popularity: 1000000,
      genres: ['Arabic pop', 'pop rock']
    }
  })
  await user3.save()
  await user3.updateOne({ href: `${process.env.API_URL}/users/${user3._id}` })
  await user3.updateOne({ uri: `spotify:users:${user3._id}` })

  const album1 = new Album({
    name: 'Ramadan 2018',
    image: `${process.env.API_URL}/public/imgs/albums/Evolve.jpg`,
    albumType: 'album',
    externalUrls: 'this should be an externalUrl',
    type: 'album',
    genre: 'Pop-rock',
    label: 'CocaCola 2018 Ramadan AD',
    releaseDate: '2018-01-01',
    artists: [user1._id],
    totalTracks: 2,
    popularity: 300000
  })
  await album1.save()
  await album1.updateOne({ href: `${process.env.API_URL}/albums/${album1._id}` })
  await album1.updateOne({ uri: `spotify:albums:${album1._id}` })

  const album2 = new Album({
    name: 'Ramadan 2017',
    image: `${process.env.API_URL}/public/imgs/albums/Divide.jpg`,
    albumType: 'album',
    externalUrls: 'this should be an externalUrl',
    type: 'album',
    genre: 'Pop-rock',
    label: 'Pepsi 2017 Ramadan Ad',
    releaseDate: '2017-01-01',
    artists: [user2._id],
    totalTracks: 1,
    popularity: 700000
  })
  await album2.save()
  await album2.updateOne({ href: `${process.env.API_URL}/albums/${album2._id}` })
  await album2.updateOne({ uri: `spotify:albums:${album2._id}` })

  const album3 = new Album({
    name: 'COVID-19 awareness',
    image: `${process.env.API_URL}/public/imgs/albums/Sahran.jpg`,
    albumType: 'album',
    externalUrls: 'this should be an externalUrl',
    type: 'album',
    genre: 'Arabic',
    label: 'awareness ad for COVID-19',
    copyrights: '© 2020 Nay',
    releaseDate: '2020-01-01',
    artists: [user3._id],
    totalTracks: 2,
    popularity: 400000
  })
  await album3.save()
  await album3.updateOne({ href: `${process.env.API_URL}/albums/${album3._id}` })
  await album3.updateOne({ uri: `spotify:albums:${album3._id}` })

  const track1 = new Track({
    name: 'Ramadan 2018',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 1,
    durationMs: 204000,
    popularity: 12000000,
    album: album1._id,
    artists: user1._id,
    audioFilePath: 'tracks/track1.mp3',
    isAd: true
  })
  await track1.save()
  await track1.updateOne({ href: `${process.env.API_URL}/tracks/${track1._id}` })
  await track1.updateOne({ uri: `spotify:tracks:${track1._id}` })
  await User.update({_id : user1Id}, { $push: {trackObjects: track1._id}}) //Update list of tracks of user
  await Album.update({_id : album1Id}, { $push: {trackObjects: track1._id}}) //Update list of tracks of Album

  const track2 = new Track({
    name: 'Ramadan 2017',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 2,
    durationMs: 187000,
    popularity: 300000,
    album: album2.id,
    artists: user2._id,
    audioFilePath: 'tracks/track2.mp3',
    isAd: true
  })
  await track2.save()
  await track2.updateOne({ href: `${process.env.API_URL}/tracks/${track2._id}` })
  await track2.updateOne({ uri: `spotify:tracks:${track2._id}` })
  await User.update({_id : user2Id}, { $push: {trackObjects: track2._id}}) //Update list of tracks of user
  await Album.update({_id : album2Id}, { $push: {trackObjects: track2._id}}) //Update list of tracks of Album

  const track3 = new Track({
    name: 'Covid 19',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 1,
    durationMs: 212000,
    popularity: 200000,
    album: album3._id,
    artists: user3._id,
    audioFilePath: 'tracks/track3.mp3',
    isAd: true
  })
  await track3.save()
  await track3.updateOne({ href: `${process.env.API_URL}/tracks/${track3._id}` })
  await track3.updateOne({ uri: `spotify:tracks:${track3._id}` })
  await User.update({_id : user3Id}, { $push: {trackObjects: track3._id}}) //Update list of tracks of user
  await Album.update({_id : album3Id}, { $push: {trackObjects: track3._id}}) //Update list of tracks of Album

  process.exit()
}
