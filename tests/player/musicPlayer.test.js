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
 * Context model from the database
 * @const
 */
const Context = require('../../models/contextModel')
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
    expect(queue[0] != 'Track1' || queue[1] != 'Track2' || queue[2] != 'Track3' || queue[3] != 'Track4' || queue[0] == 'Track1').toBeTruthy()
  })
})


// Testing starting and getting context out of playlist/album/artist
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
      artists: [validArtist._id]
    })
    testTrack2 = new Track({
      _id: '6e8cfa4ffbfe6a5764b4238c',
      name: 'Give Up',
      href: 'http://127.0.0.1:7000/tracks/6e8cfa4ffbfe6a5764b4238c',
      uri: 'spotify:tracks:6e8cfa4ffbfe6a5764b4238c',
      trackNumber: 1,
      durationMs: 200000,
      artists: [validArtist._id]
    })
    await testTrack.save()
    await testTrack2.save()
    validArtist.trackObjects = [testTrack._id, testTrack2._id]
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
    await mongoose.connection.collection('contexts').deleteMany({})
  })

  // Testing starting context without problems with track for artist
  it('Should start a context for the user using track of artist', async () => {
    expect.hasAssertions()
    playerService = new playerServices()
    await playerService.generateContext(artistId, 'artist', userId)
    const userPlayer = await Player.findOne({ 'userId': userId })
    const queue = userPlayer.queueTracksIds
    const context = Context.findById(userPlayer.context)
    //Expect the two tracks to return in the queue list
    expect((queue[0] == '5e8cfa4ffbfe6a5764b4238c' && queue[1] == '6e8cfa4ffbfe6a5764b4238c') ||
      (queue[1] == '5e8cfa4ffbfe6a5764b4238c' && queue[0] == '6e8cfa4ffbfe6a5764b4238c')).toBeTruthy()
    //Expect context to be updated to type of artist and of artist id we passed
    expect(context.type == 'artist' && context.id == artistId)
  })

  //Testing getting context from DB
  it('Should return the context for the user', async() => {
    expect.assertions(1)
    playerService = new playerServices()
    await playerService.generateContext(artistId, 'artist', userId)
    const context = await playerService.getContext(userId)
    expect(context).not.toEqual(null)
  })
})
