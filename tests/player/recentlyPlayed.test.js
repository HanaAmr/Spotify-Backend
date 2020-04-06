/** Jest unit testing for functions related to recently played
 * @module routes/player
 * @requires express
 */

/**
 * sinon
 * @const
 */
const sinon = require('sinon')
/**
 * mocking requests
 * @const
 */
const httpMocks = require('node-mocks-http')

/**
 * dotenv for environment variables
 * @const
 */
const dotenv = require('dotenv')
// Configuring environment variables to use them
dotenv.config()

/**
 * mongoose for db management
 * @const
 */
const mongoose = require('mongoose')

/**
 * express module
 * User model from the database
 * @const
 */
const User = require('../../models/userModel')

/**
 * express module
 * Play history model from the database
 * @const
 */
const PlayHistory = require('../../models/playHistoryModel')

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
 * player controller
 * @const
 */
const playerController = require('../../controllers/playerController')


/**
 * User service
 * @const
 */
const userServices = require('../../services/userService')

const mongoDB = process.env.DATABASE_LOCAL
// Connecting to the database
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!')
}

// Before all tests, insert a track to the track collection
beforeAll(async () => {
  await mongoose.connection.collection('tracks').deleteMany()
  const newTrack = new Track({
    externalUrls: [],
    popularity: 0,
    artists: [],
    name: 'track1',
    uri: '1234',
    href: 'asd',
    trackNumber: 5,
    isLocal: false,
    durationMs: 123,
    audioFilePath: 'anyDummyPath/artist/track'
  })
  await newTrack.save()
  const newTrack2 = new Track({
    externalUrls: [],
    popularity: 0,
    artists: [],
    name: 'track2',
    uri: '12345',
    href: 'asdd',
    trackNumber: 5,
    isLocal: false,
    durationMs: 123,
    audioFilePath: 'anyDummyPath/artist/track2'
  })
  await newTrack2.save()
})

// Testing adding to recently played list for a user.
describe('Adding to recently played list of a user', () => {
  // Drop the whole users, playHistory collection before testing and add a simple user to test with
  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('playhistories').deleteMany({})
    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password'
    })
    await validUser.save()
    const newArtist = new User({
      role: 'user',
      name: 'Low roar',
      email: 'DS@2019.com',
      password: 'password',
      href: 'abcd',
      uri: 'abcd',
      externalUrls: []
    })
    await newArtist.save()
    // Mock the userServices get user id function to return the testing user id.
    sinon.stub(userServices.prototype, 'getUserId').returns(validUser._id)
  })
  
  
  // Drop the whole users, playHistory collection after finishing testing
  afterAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('playhistories').deleteMany({})
    sinon.restore()
  })

  // Testing adding to recently played with no problems
  it('Should add to recently played with no problems', async (done) => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/player/recentlyPlayed',
      body: {
        contextType: 'artist', 
        contextUri: 'abcd',
        trackUri: '1234'
      }
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    await playerController.addToRecentlyPlayed(request, response)
    response.on('end',  async () => {
      try {
        const count = await PlayHistory.countDocuments()
        expect(count).toEqual(1)
        expect(response.statusCode).toEqual(204)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing adding to recently played with no problems after reaching limit of recently played
  it('Should add to recently played with no problems even after reaching limit', async (done) => {
    let env
    env = process.env
    process.env.PLAY_HISTORY_MAX_COUNT = 1

    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/player/recentlyPlayed',
      body: {
        contextType: 'artist', 
        contextUri: 'abcd',
        trackUri: '12345'
      }
    })
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    await playerController.addToRecentlyPlayed(request, response)
    response.on('end', async () => {
      try {
        const playHistoryAdded = await PlayHistory.findOne()
        expect(playHistoryAdded.track.uri).toEqual('12345')
        expect(response.statusCode).toEqual(204)
        process.env = env
        done()
      } catch (error) {
        process.env = env
        done(error)
      }
    })
  })

  // Testing adding to recently played with a track that doesn't exist
  it('Shouldn\'t add to recently played as track doens\'t exist', async (done) => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/player/recentlyPlayed',
      body: {
        contextType: 'artist', 
        contextUri: 'abcd',
        trackUri: 'invalidUri'
      }
    })
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    playerController.addToRecentlyPlayed(request, response, (err) => {
      console.log(err)
      expect(err).toEqual(expect.anything())
      expect(err.statusCode).toEqual(404)
      done()
    })
  })
})

// Testing getting recently played list for a user.
describe('Getting recently played list for a user', () => {
  // Sdd a simple user to test with
  beforeAll(async () => {
    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password'
    })
    await validUser.save()
    // Mock the userServices get user id function to return the testing user id.
    sinon.stub(userServices.prototype, 'getUserId').returns(validUser._id)
  })

  // Drop the whole users, playHistory collection after finishing testing
  afterAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('playhistories').deleteMany({})
  })

  // Testing Getting recently played with no problems
  it('Should get recently played with no problems', async (done) => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/me/player/recentlyPlayed'
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    await playerController.getRecentlyPlayed(request, response)
    response.on('end', () => {
      try {
        expect(response.statusCode).toEqual(200)
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})
