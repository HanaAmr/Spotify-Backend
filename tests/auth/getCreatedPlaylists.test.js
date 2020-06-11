const supertest = require('supertest')
const app = require('../../app')
const httpMocks = require('node-mocks-http')
const mongoose = require('mongoose')
const User = require('../../models/userModel')
const Playlist = require('./../../models/playlistModel')
const authContoller = require('../../controllers/authController')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
const mongoDB = process.env.TEST_DATABASE

jest.setTimeout(10000)

if (process.env.TEST === '1') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!')
}

describe('Get created playlists functionality', () => {
  let authToken = ''
  let id = ''
  // Drop the whole collections before testing and add a simple user to test with
  beforeEach(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('playlists').deleteMany({})

    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'ahmed',
      email: 'ahmed@email.com',
      password: 'password',
      dateOfBirth: '1999-7-14',
      gender: 'male'
    })
    await validUser.save()
    // get the id of the document in the db to use it to get authorization token
    await User.findOne({}, (err, user) => {
      id = user._id
      authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
    })

    const playlist = new Playlist({
      name: 'Imagine Dragons Radio'
    })
    await playlist.save()

    playlist.owner = validUser
    await playlist.save()

    validUser.createdPlaylists.push(playlist._id)
    await validUser.save()
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('playlists').deleteMany({})
  })

  // Testing getting created playlists successfully.
  it('Should get created playlists successfully', async () => {
    const response = await supertest(app).get('/me/createdPlaylists').set('Authorization', authToken)

    expect(response.status).toBe(200)
  })
})
