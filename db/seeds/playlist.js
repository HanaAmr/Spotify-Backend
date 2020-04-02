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
console.log(process.env.DATABASE_LOCAL)
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
 * @memberof module:seeders/categories~categorySeeder
 *
 */
createPlaylists = async () => {

    // const category1=db.collection('categories').aggregate(
    //     { $project : { _id : 1 } ,$match: {name:'Jazz'}}
    //   )//.find({name:'Jazz'},{ _id:1})//.find({name:'Jazz'})
    // console.log(category1._id)
  const playlist1 = new Playlist({
    name: "Imagine Dragons Radio",
    collaborative:false,
    externalUrl:"this should be an externalUrl",
    "images":"array of links to the images of the playlist",
    description:"Imagine Dragons",
    owner:["5e850497b0a34733d859ce42"],
    public:true,
    "snapshot_id":"5e729e8b3d8d0a432c70b59d",
    type:"playlist",
    popularity:24000000,
    noOfFollowers:2000000,
    trackObjects:["5e7179f13d8d0a432c70b595","5e717c318875f5432cff40ae"],
    category: db.collection('categories').find({name:'Jazz'},{_id:1}),
    createdAt: Date.now()
  })
  await playlist1.save()
  await playlist1.updateOne({href:`http://127.0.0.1:7000/api/v1/playlists/${playlist1._id}`})
  await playlist1.updateOne({tracks:{href:`http://127.0.0.1:7000/api/v1/playlists/${playlist1._id}/tracks`,total:2}})
  await playlist1.updateOne({uri:`spotify:playlists:${playlist1._id}`})

}
