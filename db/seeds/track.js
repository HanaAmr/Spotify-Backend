/** Seeder to have initial data for users
 * @module seeders/tracks
 * @requires express
 */

// const express = require('express')
/**
 * Track model from the database
 * @const
 */
const Track = require('../../models/trackModel')

/**
 * Album model from the database
 * @const
 */
const Album = require('../../models/albumModel')

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
  createTracks()
})

db.on('error', err => {
  console.error('connection error:', err)
})

/**
 * A function that is used to create inital seed of tracks
 * @memberof module:seeders/tracks
 * @function
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

  let user5 = User.find({ name: 'Omar' }).select('_id')
  user5 = (await user5).toString()
  start = user5.indexOf(':')
  const user5Id = user5.substring(start + 2, start + 26)
  
  let user6 = User.find({ name: 'Hana' }).select('_id')
  user6 = (await user6).toString()
  start = user6.indexOf(':')
  const user6Id = user6.substring(start + 2, start + 26)

  let user7 = User.find({ name: 'Nada' }).select('_id')
  user7 = (await user7).toString()
  start = user7.indexOf(':')
  const user7Id = user7.substring(start + 2, start + 26)

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

  let date1=new Date(2016,5,4)
  date1.setUTCHours(0,0,0)

  let date2=new Date(2017,1,2)
  date2.setUTCHours(0,0,0)

  let date3=new Date(2017,8,9)
  date3.setUTCHours(0,0,0)

  let date4=new Date(2018,0,2)
  date4.setUTCHours(0,0,0)

  let date5=new Date(2019,11,2)
  date5.setUTCHours(0,0,0)

  let date6= new Date(2020,0,1)
  date6.setUTCHours(0,0,0)
  
  let date7= new Date(2020,3,4)
  date7.setUTCHours(0,0,0)


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
    audioFilePath: 'tracks/track1.mp3',
    listensHistory:[
      {
        day: date1,
        numberOfListens: 100
      },
      {
        day: date2,
        numberOfListens: 2500
      },
      {
        day: date4,
        numberOfListens: 25
      },
      {
        day: date5,
        numberOfListens: 125
      },
      {
        day: date6,
        numberOfListens: 5
      },
      {
        day: date7,
        numberOfListens: 500
      }],
      likesHistory:[
        {
          day: date6,
          userID: user7Id
        },
        {
          day: date6,
          userID: user6Id
        },
        {
          day: date7,
          userID: user5Id
        }
      ]
  })
  await track1.save()
  await track1.updateOne({ href: `${process.env.API_URL}/tracks/${track1._id}` })
  await track1.updateOne({ uri: `spotify:tracks:${track1._id}` })
  await User.update({_id : user1Id}, { $push: {trackObjects: track1._id}}) //Update list of tracks of user
  await Album.update({_id : album1Id}, { $push: {trackObjects: track1._id}}) //Update list of tracks of Album

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
    audioFilePath: 'tracks/track2.mp3',
    listensHistory:[
      {
        day: date1,
        numberOfListens: 100
      },
      {
        day: date2,
        numberOfListens: 2500
      },
      {
        day: date4,
        numberOfListens: 25
      },
      {
        day: date5,
        numberOfListens: 125
      },
      {
        day: date6,
        numberOfListens: 5
      },
      {
        day: date7,
        numberOfListens: 500
      }],
      likesHistory:[
        {
          day: date5,
          userID: user7Id
        },
        {
          day: date6,
          userID: user6Id
        },
        {
          day: date6,
          userID: user5Id
        }
      ]

  })
  await track2.save()
  await track2.updateOne({ href: `${process.env.API_URL}/tracks/${track2._id}` })
  await track2.updateOne({ uri: `spotify:tracks:${track2._id}` })
  await User.update({_id : user1Id}, { $push: {trackObjects: track2._id}}) //Update list of tracks of user
  await Album.update({_id : album1Id}, { $push: {trackObjects: track2._id}}) //Update list of tracks of Album

  const track3 = new Track({
    _id:"5edefb60f3962c3f42577069",
    name: 'Youm Talat',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 1,
    durationMs: 212000,
    popularity: 200000,
    album: album3Id,
    artists: user3Id,
    audioFilePath: 'tracks/track3.mp3',
    listensHistory:[
      {
        day: date1,
        numberOfListens: 30000
      },
      {
        day: date2,
        numberOfListens: 25000
      },
      {
        day: date5,
        numberOfListens: 115
      },
      {
        day: date6,
        numberOfListens: 750
      },
      {
        day: date7,
        numberOfListens: 600
      }],
      likesHistory:[
        {
          day: date1,
          userID: user7Id
        },
        {
          day: date7,
          userID: user6Id
        },
        {
          day: date7,
          userID: user5Id
        }
      ]

  })
  await track3.save()
  await track3.updateOne({ href: `${process.env.API_URL}/tracks/${track3._id}` })
  await track3.updateOne({ uri: `spotify:tracks:${track3._id}` })
  await User.update({_id : user3Id}, { $push: {trackObjects: track3._id}}) //Update list of tracks of user
  await Album.update({_id : album3Id}, { $push: {trackObjects: track3._id}}) //Update list of tracks of Album

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
    audioFilePath: 'tracks/track4.mp3',
    listensHistory:[
      {
        day: date1,
        numberOfListens: 30000
      },
      {
        day: date2,
        numberOfListens: 25000
      },
      {
        day: date5,
        numberOfListens: 115
      },
      {
        day: date6,
        numberOfListens: 757
      },
      {
        day: date7,
        numberOfListens: 600
      }],
      likesHistory:[
        {
          day: date1,
          userID: user7Id
        },
        {
          day: date2,
          userID: user6Id
        },
        {
          day: date7,
          userID: user5Id
        }
      ]

  })
  await track4.save()
  await track4.updateOne({ href: `${process.env.API_URL}/tracks/${track4._id}` })
  await track4.updateOne({ uri: `spotify:tracks:${track4._id}` })
  await User.update({_id : user3Id}, { $push: {trackObjects: track4._id}}) //Update list of tracks of user
  await Album.update({_id : album3Id}, { $push: {trackObjects: track4._id}}) //Update list of tracks of Album

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
  await User.update({_id : user2Id}, { $push: {trackObjects: track5._id}}) //Update list of tracks of user
  await Album.update({_id : album2Id}, { $push: {trackObjects: track5._id}}) //Update list of tracks of Album

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
  await User.update({_id : user4Id}, { $push: {trackObjects: track6._id}}) //Update list of tracks of user
  await Album.update({_id : album4Id}, { $push: {trackObjects: track6._id}}) //Update list of tracks of Album
  
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
  await User.update({_id : user4Id}, { $push: {trackObjects: track7._id}}) //Update list of tracks of user
  await Album.update({_id : album4Id}, { $push: {trackObjects: track7._id}}) //Update list of tracks of Album

  const track8 = new Track({
    name: 'Thinking Out Loud',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 3,
    durationMs: 139000,
    popularity: 900000,
    album: album4Id,
    artists: user4Id,
    audioFilePath: 'tracks/track8.mp3',
    listensHistory:[
      
      {
        day: date2,
        numberOfListens: 50000
      },
      {
        day: date5,
        numberOfListens: 20050
      },
      {
        day: date6,
        numberOfListens: 106666
      },
      {
        day: date7,
        numberOfListens: 107000
      }],
      likesHistory:[
        {
          day: date5,
          userID: user7Id
        },
        {
          day: date6,
          userID: user6Id
        },
        {
          day: date7,
          userID: user5Id
        }
      ]
  })
  await track8.save()
  await track8.updateOne({ href: `${process.env.API_URL}/tracks/${track8._id}` })
  await track8.updateOne({ uri: `spotify:tracks:${track8._id}` })
  await User.update({_id : user4Id}, { $push: {trackObjects: track8._id}}) //Update list of tracks of user
  await Album.update({_id : album4Id}, { $push: {trackObjects: track8._id}}) //Update list of tracks of Album

  const track9 = new Track({
    name: 'Alby Etmannah',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 3,
    durationMs: 222000,
    popularity: 100000,
    album: album3Id,
    artists: user3Id,
    audioFilePath: 'tracks/track9.mp3',
    listensHistory:[
      {
        day: date1,
        numberOfListens: 100
      },
      {
        day: date2,
        numberOfListens: 50
      },
      {
        day: date5,
        numberOfListens: 1
      },
      {
        day: date6,
        numberOfListens: 153500
      },
      {
        day: date7,
        numberOfListens: 10
      }],
      likesHistory:[
        {
          day: date1,
          userID: user7Id
        },
        {
          day: date1,
          userID: user6Id
        },
        {
          day: date2,
          userID: user5Id
        }
      ]

  })
  await track9.save()
  await track9.updateOne({ href: `${process.env.API_URL}/tracks/${track9._id}` })
  await track9.updateOne({ uri: `spotify:tracks:${track9._id}` })
  await User.update({_id : user3Id}, { $push: {trackObjects: track9._id}}) //Update list of tracks of user
  await Album.update({_id : album3Id}, { $push: {trackObjects: track9._id}}) //Update list of tracks of Album

  const track10 = new Track({
    _id:"5edefb60f3962c3f4257708f",
    name: 'Ana Gheir',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 4,
    durationMs: 222000,
    popularity: 600000,
    album: album3Id,
    artists: user3Id,
    audioFilePath: 'tracks/track10.mp3'

  })
  await track10.save()
  await track10.updateOne({ href: `${process.env.API_URL}/tracks/${track10._id}` })
  await track10.updateOne({ uri: `spotify:tracks:${track10._id}` })
  await User.update({_id : user3Id}, { $push: {trackObjects: track10._id}}) //Update list of tracks of user
  await Album.update({_id : album3Id}, { $push: {trackObjects: track10._id}}) //Update list of tracks of Album

  const track11 = new Track({
    name: 'Awel Youm fel Bo3d',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 5,
    durationMs: 222000,
    popularity: 130000,
    album: album3Id,
    artists: user3Id,
    audioFilePath: 'tracks/track11.mp3'

  })
  await track11.save()
  await track11.updateOne({ href: `${process.env.API_URL}/tracks/${track11._id}` })
  await track11.updateOne({ uri: `spotify:tracks:${track11._id}` })
  await User.update({_id : user3Id}, { $push: {trackObjects: track11._id}}) //Update list of tracks of user
  await Album.update({_id : album3Id}, { $push: {trackObjects: track11._id}}) //Update list of tracks of Album

const track12 = new Track({
    name: 'Aam El Tabeeb',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 6,
    durationMs: 222000,
    popularity: 120000,
    album: album3Id,
    artists: user3Id,
    audioFilePath: 'tracks/track12.mp3'

  })
  await track12.save()
  await track12.updateOne({ href: `${process.env.API_URL}/tracks/${track12._id}` })
  await track12.updateOne({ uri: `spotify:tracks:${track12._id}` })
  await User.update({_id : user3Id}, { $push: {trackObjects: track12._id}}) //Update list of tracks of user
  await Album.update({_id : album3Id}, { $push: {trackObjects: track12._id}}) //Update list of tracks of Album



const track13 = new Track({
    name: 'Ana W Enta',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 7,
    durationMs: 222000,
    popularity: 130000,
    album: album3Id,
    artists: user3Id,
    audioFilePath: 'tracks/track13.mp3'

  })
  await track13.save()
  await track13.updateOne({ href: `${process.env.API_URL}/tracks/${track13._id}` })
  await track13.updateOne({ uri: `spotify:tracks:${track13._id}` })
  await User.update({_id : user3Id}, { $push: {trackObjects: track13._id}}) //Update list of tracks of user
  await Album.update({_id : album3Id}, { $push: {trackObjects: track13._id}}) //Update list of tracks of Album


const track14 = new Track({
    name: 'Amar Eah',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 8,
    durationMs: 222000,
    popularity: 140000,
    album: album3Id,
    artists: user3Id,
    audioFilePath: 'tracks/track14.mp3'

  })
  await track14.save()
  await track14.updateOne({ href: `${process.env.API_URL}/tracks/${track14._id}` })
  await track14.updateOne({ uri: `spotify:tracks:${track14._id}` })
  await User.update({_id : user3Id}, { $push: {trackObjects: track14._id}}) //Update list of tracks of user
  await Album.update({_id : album3Id}, { $push: {trackObjects: track14._id}}) //Update list of tracks of Album
  

const track15 = new Track({
    name: 'Ah Habiby',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 9,
    durationMs: 222000,
    popularity: 150000,
    album: album3Id,
    artists: user3Id,
    audioFilePath: 'tracks/track15.mp3'

  })
  await track15.save()
  await track15.updateOne({ href: `${process.env.API_URL}/tracks/${track15._id}` })
  await track15.updateOne({ uri: `spotify:tracks:${track15._id}` })
  await User.update({_id : user3Id}, { $push: {trackObjects: track15._id}}) //Update list of tracks of user
  await Album.update({_id : album3Id}, { $push: {trackObjects: track15._id}}) //Update list of tracks of Album
  

const track16 = new Track({
    name: 'Awel Kol Haga',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 10,
    durationMs: 222000,
    popularity: 160000,
    album: album3Id,
    artists: user3Id,
    audioFilePath: 'tracks/track16.mp3'

  })
  await track16.save()
  await track16.updateOne({ href: `${process.env.API_URL}/tracks/${track16._id}` })
  await track16.updateOne({ uri: `spotify:tracks:${track16._id}` })
  await User.update({_id : user3Id}, { $push: {trackObjects: track16._id}}) //Update list of tracks of user
  await Album.update({_id : album3Id}, { $push: {trackObjects: track16._id}}) //Update list of tracks of Album


const track17 = new Track({
    name: 'Agmal Eyoun',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 11,
    durationMs: 222000,
    popularity: 170000,
    album: album3Id,
    artists: user3Id,
    audioFilePath: 'tracks/track17.mp3'

  })
  await track17.save()
  await track17.updateOne({ href: `${process.env.API_URL}/tracks/${track17._id}` })
  await track17.updateOne({ uri: `spotify:tracks:${track17._id}` })
  await User.update({_id : user3Id}, { $push: {trackObjects: track17._id}}) //Update list of tracks of user
  await Album.update({_id : album3Id}, { $push: {trackObjects: track17._id}}) //Update list of tracks of Album


const track18 = new Track({
    name: 'Ahla W Ahla',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 12,
    durationMs: 222000,
    popularity: 180000,
    album: album3Id,
    artists: user3Id,
    audioFilePath: 'tracks/track18.mp3'

  })
  await track18.save()
  await track18.updateOne({ href: `${process.env.API_URL}/tracks/${track18._id}` })
  await track18.updateOne({ uri: `spotify:tracks:${track18._id}` })
  await User.update({_id : user3Id}, { $push: {trackObjects: track18._id}}) //Update list of tracks of user
  await Album.update({_id : album3Id}, { $push: {trackObjects: track18._id}}) //Update list of tracks of Album
  
  
const track19 = new Track({
    name: 'Aks Ba3d',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 13,
    durationMs: 222000,
    popularity: 190000,
    album: album3Id,
    artists: user3Id,
    audioFilePath: 'tracks/track19.mp3'

  })
  await track19.save()
  await track19.updateOne({ href: `${process.env.API_URL}/tracks/${track19._id}` })
  await track19.updateOne({ uri: `spotify:tracks:${track19._id}` })
  await User.update({_id : user3Id}, { $push: {trackObjects: track19._id}}) //Update list of tracks of user
  await Album.update({_id : album3Id}, { $push: {trackObjects: track19._id}}) //Update list of tracks of Album
  

const track20 = new Track({
    name: 'Ala Hobak',
    type: 'track',
    externalUrl: 'this should be an externalUrl',
    externalId: 'this should be an externalId',
    trackNumber: 14,
    durationMs: 222000,
    popularity: 200000,
    album: album3Id,
    artists: user3Id,
    audioFilePath: 'tracks/track20.mp3'

  })
  await track20.save()
  await track20.updateOne({ href: `${process.env.API_URL}/tracks/${track20._id}` })
  await track20.updateOne({ uri: `spotify:tracks:${track20._id}` })
  await User.update({_id : user3Id}, { $push: {trackObjects: track20._id}}) //Update list of tracks of user
  await Album.update({_id : album3Id}, { $push: {trackObjects: track20._id}}) //Update list of tracks of Album
  


  process.exit()
}
