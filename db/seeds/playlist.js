/** Seeder to have initial data for users
 * @module seeders/playlist
 * @requires express
 */

/**
 * Users seeder to call to fill initial database.
 * @type {object}
 * @const
 * @namespace playlistSeeder
 */

const express = require('express')
/**
 * express module
 * Category model from the database
 * @const
 */
const Playlist = require('../../models/playlistModel')
const Track = require('../../models/trackModel')
const User = require('../../models/userModel')
const Category = require('../../models/categoryModel')
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
  createPlaylists()
})

db.on('error', err => {
  console.error('connection error:', err)
})

/**
 * A function that is used to create inital seed of users
 *
 * @memberof module:seeders/playlists~playlistSeeder
 *
 */
createPlaylists = async () => {

    let category1=Category.find({'name':'Jazz'}).select('_id')
    category1= (await category1).toString()
    let start = category1.indexOf(':')      
    const category1Id = category1.substring(start + 2, start+26)

    let category2=Category.find({'name':'Happy'}).select('_id')
    category2= (await category2).toString()
    start = category2.indexOf(':')      
    const category2Id = category2.substring(start + 2, start+26)

    let category3=Category.find({'name':'Arabic'}).select('_id')
    category3= (await category3).toString()
    start = category3.indexOf(':')      
    const category3Id = category3.substring(start + 2, start+26)

    let user1=User.find({'name':'user1'}).select('_id')
    user1= (await user1).toString()
    start = user1.indexOf(':')      
    const user1Id = user1.substring(start + 2, start+26)

    let user2=User.find({'name':'user2'}).select('_id')
    user2= (await user2).toString()
    start = user2.indexOf(':')      
    const user2Id = user2.substring(start + 2, start+26)

    let user3=User.find({'name':'user3'}).select('_id')
    user3= (await user3).toString()
    start = user3.indexOf(':')      
    const user3Id = user3.substring(start + 2, start+26)

    let track1=Track.find({'name':'Believer'}).select('_id')
    track1= (await track1).toString()
    start = track1.indexOf(':')      
    const track1Id = track1.substring(start + 2, start+26)

    let track2=Track.find({'name':'Thunder'}).select('_id')
    track2= (await track2).toString()
    start = track2.indexOf(':')      
    const track2Id = track2.substring(start + 2, start+26)

    let track3=Track.find({'name':'Youm Talat'}).select('_id')
    track3= (await track3).toString()
    start = track3.indexOf(':')      
    const track3Id = track3.substring(start + 2, start+26)

    let track4=Track.find({'name':'Odam Merayetha'}).select('_id')
    track4= (await track4).toString()
    start = track4.indexOf(':')      
    const track4Id = track4.substring(start + 2, start+26)

    let track5=Track.find({'name':'What A Man Gotta Do'}).select('_id')
    track5= (await track5).toString()
    start = track5.indexOf(':')      
    const track5Id = track5.substring(start + 2, start+26)


  const playlist1 = new Playlist({
    name: "Imagine Dragons Radio",
    collaborative:false,
    externalUrl:"this should be an externalUrl",
    "images":"array of links to the images of the playlist",
    description:"Imagine Dragons",
    owner:user1Id,
    public:true,
    "snapshot_id":"5e729e8b3d8d0a432c70b59d",
    type:"playlist",
    popularity:24000000,
    noOfFollowers:2000000,
    trackObjects:[track1Id,track2Id],
    category: category1Id,
    createdAt: Date.now()
  })
  await playlist1.save()
  await playlist1.updateOne({href:`http://127.0.0.1:7000/api/v1/playlists/${playlist1._id}`})
  await playlist1.updateOne({tracks:{href:`http://127.0.0.1:7000/api/v1/playlists/${playlist1._id}/tracks`,total:2}})
  await playlist1.updateOne({uri:`spotify:playlists:${playlist1._id}`})


  const playlist2 = new Playlist({
    name: "Happy Hits",
    collaborative:false,
    externalUrl:"this should be an externalUrl",
    "images":"array of links to the images of the playlist",
    description:"Jonas Brothers,Imagine Dragons",
    owner:user2Id,
    public:true,
    "snapshot_id":"5e729e8b3d8d0a432c70b59d",
    type:"playlist",
    popularity:2000000,
    noOfFollowers:8000000,
    trackObjects:[track5Id,track3Id],
    category: category2Id,
    createdAt: Date.now()
  })
  await playlist2.save()
  await playlist2.updateOne({href:`http://127.0.0.1:7000/api/v1/playlists/${playlist2._id}`})
  await playlist2.updateOne({tracks:{href:`http://127.0.0.1:7000/api/v1/playlists/${playlist2._id}/tracks`,total:2}})
  await playlist2.updateOne({uri:`spotify:playlists:${playlist2._id}`})

  const playlist3 = new Playlist({
    name: "Chill Bel Masry",
    collaborative:false,
    externalUrl:"this should be an externalUrl",
    "images":"array of links to the images of the playlist",
    description:"Amr Diab",
    owner:user3Id,
    public:true,
    "snapshot_id":"5e729e8b3d8d0a432c70b59d",
    type:"playlist",
    popularity:50000000,
    noOfFollowers:9000000,
    trackObjects:[track3Id,track4Id],
    category: category3Id,
    createdAt: Date.now()
  })
  await playlist3.save()
  await playlist3.updateOne({href:`http://127.0.0.1:7000/api/v1/playlists/${playlist3._id}`})
  await playlist3.updateOne({tracks:{href:`http://127.0.0.1:7000/api/v1/playlists/${playlist3._id}/tracks`,total:1}})
  await playlist3.updateOne({uri:`spotify:playlists:${playlist3._id}`})


}
