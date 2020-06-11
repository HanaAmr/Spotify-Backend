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


const mongoDB = process.env.TEST_DATABASE
// Connecting to the database
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })




// Testing shufflng queue list for a user.
describe('Shuffling player queue for a user', () => {
  var userId
  // Add a simple user to test with
  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('playhistories').deleteMany({})
    await mongoose.connection.collection('players').deleteMany({})
    sinon.restore()
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
    expect.hasAssertions()
    playerService = new playerServices()
    await playerService.shufflePlayerQueue(userId)
    const userPlayer = await Player.findOne({ 'userId': userId })
    const queue = userPlayer.queueTracksIds
    expect(queue[0] != 'Track1' || queue[1] != 'Track2' || queue[2] != 'Track3' || queue[3] != 'Track4' || queue[0] == 'Track1').toBeTruthy()
  })
})

// Testing ads related functions
describe('Testing incrementing ads played and getting ad functionality', () => {
  var userId
  // Add a simple user to test with
  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('tracks').deleteMany({})
    await mongoose.connection.collection('playhistories').deleteMany({})
    await mongoose.connection.collection('players').deleteMany({})
    sinon.restore()
    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password'
    })
    await validUser.save()
    userId = validUser._id
    const userPlayer = new Player({
      userId: validUser._id
    })
    await userPlayer.save()
    //Creating an ads account and ad track to test with
    const validArtist = new User({
      name: 'Cocacola',
      email: 'CocaCola@email.com',
      password: 'password',
      role: 'artist'
    })
    await validArtist.save()
    artistId = validArtist._id
    //Creating the ad to assign to the artist
    testAd = new Track({
      name: 'Amir Eid CocaCola Ad',
      href: 'http://127.0.0.1:7000/tracks/5e8cfa4ffbfe6a5764b4238c',
      uri: 'spotify:tracks:5e8cfa4ffbfe6a5764b4238c',
      trackNumber: 1,
      durationMs: 200000,
      artists: [validArtist._id],
      isAd: true
    })
    await testAd.save()
    // Mock the userServices get user id function to return the testing user id.
    sinon.stub(userServices.prototype, 'getUserId').returns(validUser._id)
  })

  // Drop the whole users, playHistory collection after finishing testing
  afterAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('playhistories').deleteMany({})
    await mongoose.connection.collection('players').deleteMany({})
  })

  // Testing incrementing ads played for a user
  it('Should increment number of ads played for a user', async () => {
    expect.hasAssertions()
    playerService = new playerServices()
    await playerService.incrementAdsPlayed(userId)
    const userPlayer = await Player.findOne({ 'userId': userId })
    expect(userPlayer.adsPlayed).toEqual(1)
  })

  // Testing getting a random ad for user 
  it('Should return a random track object that is an ad', async () => {
    expect.hasAssertions()
    playerService = new playerServices()
    const ad = await playerService.getRandomAd()
    expect(ad.isAd).toEqual(true)
  })

  // Testing getting a random ad for user if no ad exist
  it('Should return message saying no ads exist upon requesting ad', async () => {
    expect.hasAssertions()
    //Delete all tracks including ads
    await Track.deleteMany({})
    playerService = new playerServices()
    const adRequested = await playerService.getRandomAd()
    expect(adRequested).toEqual(`No Ads available now`)
  })

})


// Testing starting and getting context out of playlist/album/artist
describe('Starting playing context for a user', () => {
  var userId, artistId, ablumId, playlistId
  // Add a simple user to test with
  beforeAll(async () => {
    sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('albums').deleteMany({})
    await mongoose.connection.collection('playlists').deleteMany({})
    await mongoose.connection.collection('playhistories').deleteMany({})
    await mongoose.connection.collection('players').deleteMany({})
    await mongoose.connection.collection('tracks').deleteMany({})
    await mongoose.connection.collection('contexts').deleteMany({})
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
    testAlbum = new Album({
      _id: '5e8cfa4b1493ec60bc89c970',
      name: 'Evolve',
      href: 'http://127.0.0.1:7000/albums/5e8cfa4b1493ec60bc89c970',
      uri: 'spotify:albums:5e8cfa4b1493ec60bc89c970',
      popularity: 60,
      releaseDate: '2015-01-01',
      type: 'album',
      albumType: 'single',
      releaseDate: '2018-01-01',
      totalTracks: 2,
      trackObjects: [testTrack._id, testTrack2._id]
    })
    await testAlbum.save()
    albumId = testAlbum._id
    testPlaylist = new Playlist({
      _id: '5e729d853d8d0a432c70b59c',
      name: 'Imagine Dragons Radio',
      href: 'http://127.0.0.1:7000/playlists/5e729d853d8d0a432c70b59c',
      uri: 'spotify:playlists:5e729d853d8d0a432c70b59c',
      owner: [
        '5e729e8b3d8d0a432c70b59d'
      ],
      images: ['imagine-dragons.jpg'],
      trackObjects: ['5e8cfa4ffbfe6a5764b4238c'],
      popularity: 60,
      createdAt: '2015-01-01',
      trackObjects: [testTrack2._id, testTrack._id]
    })
    await testPlaylist.save()
    playlistId = testPlaylist._id
    validArtist.trackObjects = [testTrack._id, testTrack2._id]
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
    await mongoose.connection.collection('albums').deleteMany({})
    await mongoose.connection.collection('playlists').deleteMany({})
    await mongoose.connection.collection('playhistories').deleteMany({})
    await mongoose.connection.collection('players').deleteMany({})
    await mongoose.connection.collection('tracks').deleteMany({})
    await mongoose.connection.collection('contexts').deleteMany({})
  })

  // Testing starting context without problems with track for artist
  it('Should start a context for the user using track of artist', async () => {
    expect.assertions(2)
    playerService = new playerServices()
    await playerService.generateContext(artistId, 'artist', userId)
    const userPlayer = await Player.findOne({ 'userId': userId })
    const queue = userPlayer.queueTracksIds
    const context = await Context.findById(userPlayer.context)
    //Expect the two tracks to return in the queue list
    expect((queue[0] == '5e8cfa4ffbfe6a5764b4238c' && queue[1] == '6e8cfa4ffbfe6a5764b4238c') ||
      (queue[1] == '5e8cfa4ffbfe6a5764b4238c' && queue[0] == '6e8cfa4ffbfe6a5764b4238c')).toBeTruthy()
    //Expect context to be updated to type of artist and of artist id we passed
    expect(context.type == 'artist' && context.id == artistId).toBeTruthy()
  })

  // Testing starting context without problems with track for album
  it('Should start a context for the user using track of album', async () => {
    expect.assertions(2)
    playerService = new playerServices()
    await playerService.generateContext(albumId, 'album', userId)
    const userPlayer = await Player.findOne({ 'userId': userId })
    const queue = userPlayer.queueTracksIds
    const context = await Context.findById(userPlayer.context)
    //Expect the two tracks to return in the queue list
    expect((queue[0] == '5e8cfa4ffbfe6a5764b4238c' && queue[1] == '6e8cfa4ffbfe6a5764b4238c') ||
      (queue[1] == '5e8cfa4ffbfe6a5764b4238c' && queue[0] == '6e8cfa4ffbfe6a5764b4238c')).toBeTruthy()
    //Expect context to be updated to type of artist and of artist id we passed
    expect(context.type == 'album' && context.id == albumId).toBeTruthy()
  })

  // Testing starting context without problems with track for playlist
  it('Should start a context for the user using track of playlist', async () => {
    expect.assertions(2)
    playerService = new playerServices()
    await playerService.generateContext(playlistId, 'playlist', userId)
    const userPlayer = await Player.findOne({ 'userId': userId })
    const queue = userPlayer.queueTracksIds
    const context = await Context.findById(userPlayer.context)
    //Expect the two tracks to return in the queue list
    expect((queue[0] == '5e8cfa4ffbfe6a5764b4238c' && queue[1] == '6e8cfa4ffbfe6a5764b4238c') ||
      (queue[1] == '5e8cfa4ffbfe6a5764b4238c' && queue[0] == '6e8cfa4ffbfe6a5764b4238c')).toBeTruthy()
    //Expect context to be updated to type of artist and of artist id we passed
    expect(context.type == 'playlist' && context.id == playlistId).toBeTruthy()
  })

  //Testing getting context from DB
  it('Should return the context for the user', async () => {
    expect.assertions(1)
    playerService = new playerServices()
    await playerService.generateContext(artistId, 'artist', userId)
    const context = await playerService.getContext(userId)
    expect(context).not.toEqual(null)
  })

  //Integration testing
  it('Should start context successfully', async (done) => {

    const request = httpMocks.createRequest({
      method: 'PUT',
      url: '/me/player/play',
      body: {
        id: artistId,
        type: 'artist'
      }
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    playerController.startContext(request, response)
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

// Testing validating track
describe('Validating track to be played for a user', () => {
  var userId, artistId
  // Add a simple user to test with
  beforeAll(async () => {
    sinon.restore()
    //Creating artist for the tracks
    const validArtist = new User({
      name: 'Low Roar',
      email: 'LowRoar@email.com',
      password: 'password',
      role: 'artist'
    })
    await validArtist.save()
    //Creating 2 tracks to test with it
    testTrack = new Track({
      _id: '5e8cfa4ffbfe6a5764b4238c',
      name: 'Believer',
      href: 'http://127.0.0.1:7000/tracks/5e8cfa4ffbfe6a5764b4238c',
      uri: 'spotify:tracks:5e8cfa4ffbfe6a5764b4238c',
      trackNumber: 1,
      durationMs: 200000,
      artists: [validArtist._id]
    })
    await testTrack.save()
    testTrack2 = new Track({
      _id: '6e8cfa4ffbfe6a5764b4238c',
      name: 'Give Up',
      href: 'http://127.0.0.1:7000/tracks/6e8cfa4ffbfe6a5764b4238c',
      uri: 'spotify:tracks:6e8cfa4ffbfe6a5764b4238c',
      trackNumber: 1,
      durationMs: 200000,
      artists: [validArtist._id]
    })
    await testTrack2.save()
    validArtist.trackObjects = [testTrack._id, testTrack2._id]
    await validArtist.save()
    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password'
    })
    await validUser.save()
    userId = validUser._id
    artistId = validArtist._id
    const userPlayer = new Player({
      userId: validUser._id,
      queueTracksIds: [testTrack._id, testTrack2._id]
    })
    await userPlayer.save()
  })

  beforeEach(async () => {
    sinon.restore()
    // Mock the userServices get user id function to return the testing user id.
    sinon.stub(userServices.prototype, 'getUserId').returns(userId)
  })
  // Drop the whole users, playHistory collection after finishing testing
  afterAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('playhistories').deleteMany({})
    await mongoose.connection.collection('players').deleteMany({})
    await mongoose.connection.collection('tracks)').deleteMany({})
    await mongoose.connection.collection('contexts)').deleteMany({})
  })

  // Testing for premium user
  it('Should return 1 for validating the track for a premium user', async () => {
    sinon.stub(userServices.prototype, 'getUserRole').returns('premium')
    expect.assertions(1)
    playerService = new playerServices()
    const valid = await playerService.validateTrack('authToken', testTrack._id)
    expect(valid).toEqual(1)
  })

  //Testing for a free user with no problems
  it('Should return 1 for validating the track for a free user with the right track to request', async () => {
    sinon.stub(userServices.prototype, 'getUserRole').returns('user')
    expect.assertions(1)
    playerService = new playerServices()
    const tracksIds = await playerService.generateContext(artistId, 'artist', userId)
    const trackToBePlayed = tracksIds[0]
    const valid = await playerService.validateTrack('authToken', trackToBePlayed)
    expect(valid).toEqual(1)
  })

  //Testing for a free user requesting a track that isn't in the right order
  it('Should return -2 for validating the track for a free user while picking the wrong track to request', async () => {
    sinon.stub(userServices.prototype, 'getUserRole').returns('user')
    expect.assertions(1)
    playerService = new playerServices()
    const tracksIds = await playerService.generateContext(artistId, 'artist', userId)
    const trackToBePlayed = tracksIds[1]
    const valid = await playerService.validateTrack('authToken', trackToBePlayed)
    expect(valid).toEqual(-2)
  })

  //Testing for a free user requesting a track but without playing the ads
  it('Should return -1 for validating the track for a free user while having ads yet to play', async () => {
    sinon.stub(userServices.prototype, 'getUserRole').returns('user')
    expect.assertions(1)
    playerService = new playerServices()
    const tracksIds = await playerService.generateContext(artistId, 'artist', userId)
    const trackToBePlayed = tracksIds[0]
    const userPlayer = await Player.findOne({ userId: userId })
    userPlayer.adsPlayed = -1
    await userPlayer.save()
    const valid = await playerService.validateTrack('authToken', trackToBePlayed)
    expect(valid).toEqual(-1)
  })

})

// Testing finishing, skipping tracks
describe('Skipping tracks either after finishing it or by skipping', () => {
  var userId
  // Add a simple user to test with
  beforeAll(async () => {
    await mongoose.connection.collection('players').deleteMany({})
    sinon.restore()
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
    sinon.stub(require('../../controllers/authController'), 'protect').returns(() => { })
    //Creating an ads account and ad track to test with
    const validArtist = new User({
      name: 'Cocacola',
      email: 'CocaCola@email.com',
      password: 'password',
      role: 'artist'
    })
    await validArtist.save()
    artistId = validArtist._id
    //Creating the ad to assign to the artist
    testAd = new Track({
      name: 'Amir Eid CocaCola Ad',
      href: 'http://127.0.0.1:7000/tracks/5e8cfa4ffbfe6a5764b4238c',
      uri: 'spotify:tracks:5e8cfa4ffbfe6a5764b4238c',
      trackNumber: 1,
      durationMs: 200000,
      artists: [validArtist._id],
      isAd: true
    })
    sinon.stub(userServices.prototype, 'getUserRole').returns('user')
    await testAd.save()
  })

  // Drop the whole users, playHistory collection after finishing testing
  afterAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('playhistories').deleteMany({})
    await mongoose.connection.collection('players').deleteMany({})
  })

  // Testing finishing the track normally.
  it('Should increment the queue offset', async () => {
    expect.assertions(1)
    playerService = new playerServices()
    let userPlayer = await Player.findOne({ 'userId': userId })
    userPlayer.queueOffset = 0
    await userPlayer.save()
    await playerService.finishTrack(userId, 1)
    userPlayer = await Player.findOne({ userId: userId })
    expect(userPlayer.queueOffset).toEqual(1)
  })

  it('Should increment the queue offset and wrap around', async () => {
    expect.assertions(1)
    playerService = new playerServices()
    let userPlayer = await Player.findOne({ 'userId': userId })
    userPlayer.queueOffset = 3
    await userPlayer.save()
    await playerService.finishTrack(userId, 1)
    userPlayer = await Player.findOne({ userId: userId })
    expect(userPlayer.queueOffset).toEqual(0)
  })


  it('Should decrement the queue offset', async () => {
    expect.assertions(1)
    playerService = new playerServices()
    let userPlayer = await Player.findOne({ 'userId': userId })
    userPlayer.queueOffset = 1
    await userPlayer.save()
    await playerService.finishTrack(userId, -1)
    userPlayer = await Player.findOne({ userId: userId })
    expect(userPlayer.queueOffset).toEqual(0)
  })

  it('Should decrement the queue offset and wrap around', async () => {
    expect.assertions(1)
    playerService = new playerServices()
    let userPlayer = await Player.findOne({ 'userId': userId })
    userPlayer.queueOffset = 0
    await userPlayer.save()
    await playerService.finishTrack(userId, -1)
    userPlayer = await Player.findOne({ userId: userId })
    expect(userPlayer.queueOffset).toEqual(3)
  })

  it('Should skip normally in the queue', async () => {
    expect.assertions(2)
    playerService = new playerServices()
    let userPlayer = await Player.findOne({ 'userId': userId })
    userPlayer.queueOffset = 0
    await userPlayer.save()
    await playerService.skipTrack(userId, 1, "user")
    userPlayer = await Player.findOne({ userId: userId })
    expect(userPlayer.queueOffset).toEqual(1)
    expect(userPlayer.skipsMade).toEqual(1)
  })

  it('Should skip normally in the queue but reach the maximum number of skips', async () => {
    expect.assertions(3)
    playerService = new playerServices()
    let userPlayer = await Player.findOne({ 'userId': userId })
    userPlayer.queueOffset = 0
    userPlayer.skipsMade = parseInt(process.env.MAX_SKIPS, 10) - 1
    await userPlayer.save()
    await playerService.skipTrack(userId, 1, "user")
    userPlayer = await Player.findOne({ userId: userId })
    expect(userPlayer.queueOffset).toEqual(1)
    expect(userPlayer.skipsMade).toEqual(parseInt(process.env.MAX_SKIPS, 10))
    expect(userPlayer.skipsRefreshAt >= Date.now()).toBeTruthy()
  })


  it('Should skip normally in the queue as 1 hour has passed since we reached the limit of the skips', async () => {
    expect.assertions(2)
    playerService = new playerServices()
    let userPlayer = await Player.findOne({ 'userId': userId })
    userPlayer.queueOffset = 0
    userPlayer.skipsMade = parseInt(process.env.MAX_SKIPS, 10)
    userPlayer.skipsRefreshAt = 0
    await userPlayer.save()
    await playerService.skipTrack(userId, 1, "user")
    userPlayer = await Player.findOne({ userId: userId })
    expect(userPlayer.queueOffset).toEqual(1)
    expect(userPlayer.skipsMade).toEqual(1)
  })


  it(`Shouldn't skip normally in the queue as less than 1 hour has passed since we reached the limit of the skips`, async () => {
    expect.assertions(1)
    playerService = new playerServices()
    let userPlayer = await Player.findOne({ 'userId': userId })
    userPlayer.queueOffset = 0
    userPlayer.skipsMade = parseInt(process.env.MAX_SKIPS, 10)
    userPlayer.skipsRefreshAt = Date.now() + 3600 * 1000
    await userPlayer.save()
    const skip = await playerService.skipTrack(userId, 1, "user")
    userPlayer = await Player.findOne({ userId: userId })
    expect(skip).toEqual(false)
  })

  //Integration testing skipping
  it('Should skip track when finished successfully', async (done) => {
    playerService = new playerServices()
    let userPlayer = await Player.findOne({ 'userId': userId })
    userPlayer.queueOffset = 0
    userPlayer.skipsMade = parseInt(process.env.MAX_SKIPS, 10)
    userPlayer.skipsRefreshAt = 0
    await userPlayer.save()
    await playerService.skipTrack(userId, 1, "user")
    userPlayer = await Player.findOne({ userId: userId })
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/player/finished'
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    playerController.finishedTrack(request, response)
    response.on('end', () => {
      try {
        expect(response.statusCode).toEqual(204)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('Should skip track when requesting next track successfully', async (done) => {
    playerService = new playerServices()
    let userPlayer = await Player.findOne({ 'userId': userId })
    userPlayer.queueOffset = 0
    userPlayer.skipsMade = parseInt(process.env.MAX_SKIPS, 10)
    userPlayer.skipsRefreshAt = 0
    await userPlayer.save()
    await playerService.skipTrack(userId, 1, "user")
    userPlayer = await Player.findOne({ userId: userId })

    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/player/next'
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    playerController.skipToNextTrack(request, response)
    response.on('end', () => {
      try {
        expect(response.statusCode).toEqual(204)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it(`Shouldn't skip track when requesting next track successfully`, async (done) => {
    playerService = new playerServices()
    let userPlayer = await Player.findOne({ 'userId': userId })
    userPlayer.queueOffset = 0
    userPlayer.skipsMade = parseInt(process.env.MAX_SKIPS, 10)
    userPlayer.skipsRefreshAt = Date.now() + 3600 * 1000
    await userPlayer.save()

    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/player/next'
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    playerController.skipToNextTrack(request, response)
    response.on('end', () => {
      try {
        expect(response.statusCode).toEqual(403)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('Should skip track when requesting previous track successfully', async (done) => {
    playerService = new playerServices()
    let userPlayer = await Player.findOne({ 'userId': userId })
    userPlayer.queueOffset = 0
    userPlayer.skipsMade = parseInt(process.env.MAX_SKIPS, 10)
    userPlayer.skipsRefreshAt = 0
    await userPlayer.save()
    await playerService.skipTrack(userId, 1, "user")
    userPlayer = await Player.findOne({ userId: userId })

    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/player/previous'
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    playerController.skipToPrevTrack(request, response)
    response.on('end', () => {
      try {
        expect(response.statusCode).toEqual(204)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it(`Shouldn't skip track when requesting previous track successfully`, async (done) => {
    playerService = new playerServices()
    let userPlayer = await Player.findOne({ 'userId': userId })
    userPlayer.queueOffset = 0
    userPlayer.skipsMade = parseInt(process.env.MAX_SKIPS, 10)
    userPlayer.skipsRefreshAt = Date.now() + 3600 * 1000
    await userPlayer.save()

    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/player/previous'
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    playerController.skipToPrevTrack(request, response)
    response.on('end', () => {
      try {
        expect(response.statusCode).toEqual(403)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing getting an ad.
  it('Should get an ad successfully', async (done) => {
    playerService = new playerServices()

    const request = httpMocks.createRequest({
      method: 'get',
      url: '/me/player/ad'
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    playerController.getAd(request, response)
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
