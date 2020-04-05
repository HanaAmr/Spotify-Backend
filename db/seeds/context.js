/** Seeder to have initial data for contexts
 * @module seeders/playlist
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
  createContexts()
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
createContexts = async () => {


    let playlist1= await Playlist.find({'name':'Imagine Dragons Radio'})

    let playlist2= await Playlist.find({'name':'Happy Hits'})


    let playlist3= await Playlist.find({'name':'Chill Bel Masry'})
    

    let album1= await Album.find({'name':'Divide'}).select('_id')
    

    let artist1= await User.find({'name':'21 Pilots'}).select('_id')
    

  const context1 = new Context({
    externalUrls: 'Should be an external url',
    href: 'Should be a href',
    type: 'playlist',
    name: playlist1[0].name,
    images: playlist1[0].images,
    followersCount: playlist1[0].noOfFollowers
  })
  await context1.save()
  await context1.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/playlists/${playlist1[0]._id}`})
  await context1.updateOne({uri:`spotify:playlists:${playlist1[0]._id}`})

  const context2 = new Context({
    externalUrls: 'Should be an external url',
    type: 'playlist',
    href: 'Should be a href',
    name: playlist2[0].name,
    images: playlist2[0].images,
    followersCount: playlist2[0].noOfFollowers
  })
  await context2.save()
  await context2.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/playlists/${playlist2[0]._id}`})
  await context2.updateOne({uri:`spotify:playlists:${playlist2[0]._id}`})

  const context3 = new Context({
    externalUrls: 'Should be an external url',
    type: 'playlist',
    href: 'Should be a href',
    name: playlist3[0].name,
    images: playlist3[0].images,
    followersCount: playlist3[0].noOfFollowers
  })
  await context3.save()
  await context3.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/playlists/${playlist3[0]._id}`})
  await context3.updateOne({uri:`spotify:playlists:${playlist3[0]._id}`})


  const context4 = new Context({
    externalUrls: 'Should be an external url',
    type: 'album',
    href: 'Should be a href',
    name: album1[0].name,
    images: album1[0].images,
    followersCount: album1[0].popularity
  })
  await context4.save()
  await context4.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/albums/${album1[0]._id}`})
  await context4.updateOne({uri:`spotify:albums:${album1[0]._id}`})

  
  const context5 = new Context({
    externalUrls: 'Should be an external url',
    type: 'album',
    href: 'Should be a href',
    name: artist1[0].name,
    images: artist1[0].images,
    followersCount: artist1[0].followers.length()
  })
  await context5.save()
  await context5.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/albums/${artist1[0]._id}`})
  await context5.updateOne({uri:`spotify:albums:${artist1[0]._id}`})

  
  
}
