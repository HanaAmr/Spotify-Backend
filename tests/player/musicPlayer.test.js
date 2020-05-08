// /** Jest unit testing for functions related to music playing
//  * @module routers/player
//  * @requires express
//  */

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
 * Player model from the database
 * @const
 */
const Player = require('../../models/playerModel')

/**
 * express module
 * Play history model from the database
 * @const
 */
const PlayHistory = require('../../models/playHistoryModel')

/**
 * Album model from the database
 * @const
 */
const Album = require('../../models/albumModel')

/**
 * express module
 * Playlit model from the database
 * @const
 */
const Playlist = require('../../models/playlistModel')

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
/**
 * Player service
 * @const
 */
const playerServices = require('../../services/playerService')


const mongoDB = process.env.DATABASE_LOCAL
// Connecting to the database
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!')
}



// Testing shufflng queue list for a user.
describe('Shuffling player queue for a user', () => {
  var userId
  // Add a simple user to test with
  beforeAll(async () => {
    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password'
    })
    await validUser.save()
    userId = validUser._id
    const userPlayer = new Player({
      userId: validUser._id,
      queueTracksIds: ['Track1', 'Track2', 'Track3', 'Track4']
    })
    await userPlayer.save()
    // Mock the userServices get user id function to return the testing user id.
    sinon.stub(userServices.prototype, 'getUserId').returns(validUser._id)
  })

  // Drop the whole users, playHistory collection after finishing testing
  afterAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('playhistories').deleteMany({})
    await mongoose.connection.collection('players').deleteMany({})
  })

  // Testing Shuffling without problems
  it('Should shuffle the player queue for the use', async () => {
    // At least two tracks positions should be swapped.
    expect.hasAssertions()
    playerService = new playerServices()
    await playerService.shufflePlayerQueue(userId)
    const userPlayer = await Player.findOne({ 'userId': userId })
    const queue = userPlayer.queueTracksIds
    expect(queue[0] != 'Track1' || queue[1] != 'Track2' || queue[2] != 'Track3' || queue[3] != 'Track4').toBeTruthy()
  })
})


// Testing starting context out of playlist/album/artist
describe('Starting playing context for a user', () => {
  var userId, artistId
  // Add a simple user to test with
  beforeAll(async () => {
    sinon.restore()
    // Creating the valid user to assign the al to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password'
    })
    await validUser.save()
    userId = validUser._id
    const validArtist = new User({
      name: 'Low Roar',
      email: 'LowRoar@email.com',
      password: 'password',
      role: 'artist'
    })
    await validArtist.save()
    artistId = validArtist._id
    //Creating the track to assign to the artist
    testTrack = new Track({
      _id: '5e8cfa4ffbfe6a5764b4238c',
      name: 'Believer',
      href: 'http://127.0.0.1:7000/tracks/5e8cfa4ffbfe6a5764b4238c',
      uri: 'spotify:tracks:5e8cfa4ffbfe6a5764b4238c',
      trackNumber: 1,
      durationMs: 200000,
      artists: [ validArtist._id ]
    })
    await testTrack.save()
    validArtist.trackObjects = [testTrack._id]
    validArtist.uri = artistId
    await validArtist.save()
    const userPlayer = new Player({
      userId: validUser._id
    })
    await userPlayer.save()
    // Mock the userServices get user id function to return the testing user id.
    sinon.stub(userServices.prototype, 'getUserId').returns(validUser._id)
  })

  // Drop the whole users, playHistory collection after finishing testing
  afterAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('playhistories').deleteMany({})
    await mongoose.connection.collection('players').deleteMany({})
    await mongoose.connection.collection('tracks').deleteMany({})
  })

  // Testing starting context without problems with track for artist
  it('Should start a context for the user using track of artist', async () => {
    // At least two tracks positions should be swapped.
    expect.hasAssertions()
    playerService = new playerServices()
    await playerService.generateContext(artistId, 'artist', userId)
    const userPlayer = await Player.findOne({ 'userId': userId })
    const queue = userPlayer.queueTracksIds
    expect(queue[0] != 'Believer').toBeTruthy()
  })
})
