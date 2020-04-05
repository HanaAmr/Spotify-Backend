/** Seeder to have initial data for users
 * @module seeders/album
 * @requires express
 */

/**
 * Users seeder to call to fill initial database.
 * @type {object}
 * @const
 * @namespace albumSeeder
 */

const express = require('express')
/**
 * express module
 * Album model from the database
 * @const
 */
const Album = require('../../models/albumModel')
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
  createAlbums()
})

db.on('error', err => {
  console.error('connection error:', err)
})

/**
 * A function that is used to create inital seed of users
 *
 * @memberof module:seeders/albums~albumSeeder
 *
 */
createAlbums = async () => {

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

  const album1 = new Album({
    name:"Evolve",
    images:["Evolve.jpg"],
    albumType:"album",
    externalUrls:"this should be an externalUrl",
    type:"album",
    genre:"Pop-rock",
    label:"Imagine Dragons Album",
    copyrights:"© 2018 KIDinaKORNER/Interscope Records",
    releaseDate:"2018-01-01",
    artists:user1Id,
    totalTracks:2,
    popularity:300000
  })
  await album1.save()
  await album1.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/albums/${album1._id}`})
  await album1.updateOne({uri:`spotify:albums:${album1._id}`})

  const album2 = new Album({
    name:"Divide",
    images:["Divide.jpg"],
    albumType:"album",
    externalUrls:"this should be an externalUrl",
    type:"album",
    genre:"Pop-rock",
    label:"Ed Sheeran Album",
    copyrights:"© 2017 Asylum Records UK, a division of Atlantic Records UK, a Warner Music Group company.",
    releaseDate:"2017-01-01",
    artists:user2Id,
    totalTracks:1,
    popularity:700000
  })
  await album2.save()
  await album2.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/albums/${album2._id}`})
  await album2.updateOne({uri:`spotify:albums:${album2._id}`})

  const album3 = new Album({
    name:"Sahran",
    images:["Sahran.jpg"],
    albumType:"album",
    externalUrls:"this should be an externalUrl",
    type:"album",
    genre:"Arabic",
    label:"Amr Diab",
    copyrights:"© 2020 Nay",
    releaseDate:"2020-01-01",
    artists:user3Id,
    totalTracks:2,
    popularity:400000
  })
  await album3.save()
  await album3.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/albums/${album3._id}`})
  await album3.updateOne({uri:`spotify:albums:${album3._id}`})

  const album4 = new Album({
    name:"Blurry Face",
    images:["Blurryface.jpg"],
    albumType:"album",
    externalUrls:"this should be an externalUrl",
    type:"album",
    genre:"Pop",
    label:"21 pilots album",
    copyrights:"© 2015 Fueled By Ramen LLC for the United States and WEA International Inc. for the world outside of the United States. A Warner Music Group Company",
    releaseDate:"2015-01-01",
    artists:user4Id,
    totalTracks:3,
    popularity:100000
  })
  await album4.save()
  await album4.updateOne({href:`http://127.0.0.1:${process.env.PORT}/api/v1/albums/${album4._id}`})
  await album4.updateOne({uri:`spotify:albums:${album4._id}`})

}
