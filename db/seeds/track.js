/** Seeder to have initial data for users
 * @module seeders/album
 * @requires express
 */

/**
 * Users seeder to call to fill initial database.
 * @type {object}
 * @const
 * @namespace trackSeeder
 */

const express = require('express')
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

//const app = express()
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
  createTracks()
})

db.on('error', err => {
  console.error('connection error:', err)
})

/**
 * A function that is used to create inital seed of tracks
 *
 * @memberof module:seeders/tracks~trackSeeder
 *
 */
createTracks = async () => {

    let user1=User.find({'name':'user1'}).select('_id')
    user1= (await user1).toString()
    let start = user1.indexOf(':')      
    const user1Id = user1.substring(start + 2, start+26)

    let user2=User.find({'name':'user2'}).select('_id')
    user2= (await user2).toString()
    start = user2.indexOf(':')      
    const user2Id = user2.substring(start + 2, start+26)

    let user3=User.find({'name':'user3'}).select('_id')
    user3= (await user3).toString()
    start = user3.indexOf(':')      
    const user3Id = user3.substring(start + 2, start+26)

    let album1=Album.find({'name':'Evolve'}).select('_id')
    album1= (await album1).toString()
    start = album1.indexOf(':')      
    const album1Id = album1.substring(start + 2, start+26)

    let album2=Album.find({'name':'Divide'}).select('_id')
    album2= (await album2).toString()
    start = album2.indexOf(':')      
    const album2Id = album2.substring(start + 2, start+26)

    let album3=Album.find({'name':'Sahran'}).select('_id')
    album3= (await album3).toString()
    start = album3.indexOf(':')      
    const album3Id = album3.substring(start + 2, start+26)

    let album4=Album.find({'name':'Blurry Face'}).select('_id')
    album4= (await album4).toString()
    start = album4.indexOf(':')      
    const album4Id = album4.substring(start + 2, start+26)

  const track1 = new Track({
    name:"Believer",
    description:"Imagine Dragons Song",
    type:"track",
    externalUrl:"this should be an externalUrl",
    externalId:"this should be an externalId",
    trackNumber:1,
    isLocal:false,
    durationMs:204000,
    popularity:12000000,
    album:album1Id,
    artists:user1Id
    
  })
  await track1.save()
  await track1.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/tracks/${track1._id}`})
  await track1.updateOne({uri:`spotify:tracks:${track1._id}`})

  
  const track2 = new Track({
    name:"Thunder",
    description:"Imagine Dragons Song",
    type:"track",
    externalUrl:"this should be an externalUrl",
    externalId:"this should be an externalId",
    trackNumber:2,
    isLocal:false,
    durationMs:187000,
    popularity:300000,
    album:album1Id,
    artists:user1Id
    
  })
  await track2.save()
  await track2.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/tracks/${track2._id}`})
  await track2.updateOne({uri:`spotify:tracks:${track2._id}`})

  const track3 = new Track({
    name:"Youm Talat",
    description:"Amr Diab song",
    type:"track",
    externalUrl:"this should be an externalUrl",
    externalId:"this should be an externalId",
    trackNumber:1,
    isLocal:false,
    durationMs:212000,
    popularity:200000,
    album:album3Id,
    artists:user3Id
    
  })
  await track3.save()
  await track3.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/tracks/${track3._id}`})
  await track3.updateOne({uri:`spotify:tracks:${track3._id}`})

  const track4 = new Track({
    name:"Odam Merayetha",
    description:"Amr Diab song",
    type:"track",
    externalUrl:"this should be an externalUrl",
    externalId:"this should be an externalId",
    trackNumber:2,
    isLocal:false,
    durationMs:222000,
    popularity:200000,
    album:album3Id,
    artists:user3Id
    
  })
  await track4.save()
  await track4.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/tracks/${track4._id}`})
  await track4.updateOne({uri:`spotify:tracks:${track4._id}`})

  const track5 = new Track({
    name:"Perfect",
    description:"Ed Sheeran song",
    type:"track",
    externalUrl:"this should be an externalUrl",
    externalId:"this should be an externalId",
    trackNumber:1,
    isLocal:false,
    durationMs:180000,
    popularity:500000,
    album:album2Id,
    artists:user2Id
    
  })
  await track5.save()
  await track5.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/tracks/${track5._id}`})
  await track5.updateOne({uri:`spotify:tracks:${track5._id}`})

  const track6 = new Track({
    name:"Stressed Out",
    description:"21 pilots song",
    type:"track",
    externalUrl:"this should be an externalUrl",
    externalId:"this should be an externalId",
    trackNumber:1,
    isLocal:false,
    durationMs:202000,
    popularity:300000,
    album:album4Id,
    artists:user4Id
    
  })
  await track6.save()
  await track6.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/tracks/${track6._id}`})
  await track6.updateOne({uri:`spotify:tracks:${track6._id}`})

  const track7 = new Track({
    name:"Ride",
    description:"21 pilots song",
    type:"track",
    externalUrl:"this should be an externalUrl",
    externalId:"this should be an externalId",
    trackNumber:2,
    isLocal:false,
    durationMs:214000,
    popularity:600000,
    album:album4Id,
    artists:user4Id
    
  })
  await track7.save()
  await track7.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/tracks/${track7._id}`})
  await track7.updateOne({uri:`spotify:tracks:${track7._id}`})


}
