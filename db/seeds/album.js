/** Seeder to have initial data for users
 * @module seeders/albums
 * @requires express
 */


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
  createAlbums()
})

db.on('error', err => {
  console.error('connection error:', err)
})

/**
 * A function that is used to create inital seed of albums
 * @memberof module:seeders/albums
 * @function
 */
createAlbums = async () => {
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

  let date6= new Date(2020,0,25)
  date6.setUTCHours(0,0,0)
  
  let date7= new Date(2020,1,4)
  date7.setUTCHours(0,0,0)

  const album1 = new Album({
    name: 'Evolve',
    image: `${process.env.API_URL}/public/imgs/albums/Evolve.jpg`,
    albumType: 'album',
    externalUrls: 'this should be an externalUrl',
    type: 'album',
    genre: 'Pop-rock',
    label: 'Imagine Dragons Album',
    copyrights: '© 2018 KIDinaKORNER/Interscope Records',
    releaseDate: '2018-01-01',
    artists: [user1Id],
    totalTracks: 2,
    popularity: 300000,
    listensHistory:[
      {
        day: date1,
        numberOfListens: 200
      },
      {
        day: date2,
        numberOfListens: 500
      },
      {
        day: date4,
        numberOfListens: 50
      },
      {
        day: date5,
        numberOfListens: 250
      },
      {
        day: date6,
        numberOfListens: 10
      },
      {
        day: date7,
        numberOfListens: 1000
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
  await album1.save()
  await album1.updateOne({ href: `${process.env.API_URL}/albums/${album1._id}` })
  await album1.updateOne({ uri: `spotify:albums:${album1._id}` })

  const album2 = new Album({
    name: 'Divide',
    image: `${process.env.API_URL}/public/imgs/albums/Divide.jpg`,
    albumType: 'album',
    externalUrls: 'this should be an externalUrl',
    type: 'album',
    genre: 'Pop-rock',
    label: 'Ed Sheeran Album',
    copyrights: '© 2017 Asylum Records UK, a division of Atlantic Records UK, a Warner Music Group company.',
    releaseDate: '2017-01-01',
    artists: [user2Id],
    totalTracks: 1,
    popularity: 700000,
    listensHistory:[
      {
        day: date2,
        numberOfListens: 5000
      },
      {
        day: date4,
        numberOfListens: 6000
      },
      {
        day: date6,
        numberOfListens: 10000
      },
      {
        day: date7,
        numberOfListens: 1000
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
  await album2.save()
  await album2.updateOne({ href: `${process.env.API_URL}/albums/${album2._id}` })
  await album2.updateOne({ uri: `spotify:albums:${album2._id}` })

  const album3 = new Album({
    _id:"5edefb5fd1537f3f33f91340",
    name: 'Sahran',
    image: `${process.env.API_URL}/public/imgs/albums/Sahran.jpg`,
    albumType: 'album',
    externalUrls: 'this should be an externalUrl',
    type: 'album',
    genre: 'Arabic',
    label: 'Amr Diab',
    copyrights: '© 2020 Nay',
    releaseDate: '2020-01-01',
    artists: [user3Id],
    totalTracks: 14,
    popularity: 400000,
    listensHistory:[
      {
        day: date1,
        numberOfListens: 60000
      },
      {
        day: date2,
        numberOfListens: 50000
      },
      {
        day: date5,
        numberOfListens: 230
      },
      {
        day: date6,
        numberOfListens: 15007
      },
      {
        day: date7,
        numberOfListens: 1200
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
  await album3.save()
  await album3.updateOne({ href: `${process.env.API_URL}/albums/${album3._id}` })
  await album3.updateOne({ uri: `spotify:albums:${album3._id}` })

  const album4 = new Album({
    name: 'Blurry Face',
    image: `${process.env.API_URL}/public/imgs/albums/Blurryface.jpg`,
    albumType: 'album',
    externalUrls: 'this should be an externalUrl',
    type: 'album',
    genre: 'Pop',
    label: '21 pilots album',
    copyrights: '© 2015 Fueled By Ramen LLC for the United States and WEA International Inc. for the world outside of the United States. A Warner Music Group Company',
    releaseDate: '2015-01-01',
    artists: [user4Id],
    totalTracks: 3,
    popularity: 100000,
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
      }]
  })
  await album4.save()
  await album4.updateOne({ href: `${process.env.API_URL}/albums/${album4._id}` })
  await album4.updateOne({ uri: `spotify:albums:${album4._id}` })
  process.exit()
}
