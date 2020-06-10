// /** Jest unit testing for functions related to recently played
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
 * Player model from the database
 * @const
 */
const Player = require('../../models/playerModel')

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

// Testing adding to recently played
describe('Adding to recently played for a user', () => {
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
    testTrack.album = testAlbum._id
    testTrack2.album = testAlbum._id
    await testTrack.save()
    await testTrack2.save()
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

  beforeEach(async () => {
    await mongoose.connection.collection('playhistories').deleteMany({})
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
  it('Should start a context for the user using track of artist', async (done) => {
    //Generate context first to be able to use in recently played
    playerService = new playerServices()
    await playerService.generateContext(artistId, 'artist', userId)
    
    
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/player/recentlyPlayed',
      headers:{
        authorization: ''
      }
    })
    
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    playerController.addToRecentlyPlayed(request, response)
    response.on('end', async () => {
      try {
        const playHistoryAdded = await PlayHistory.findOne()
        expect(playHistoryAdded.context.type).toEqual('artist')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing deleting recently played if we reached the maximum of recently played
  it('Should delete the oldest recently played saved in player history as we reached the maximum', async (done) => {
    expect.assertions(2)
    //Generate context first to be able to use in recently played
    playerService = new playerServices()
    await playerService.generateContext(artistId, 'artist', userId)
    
    //Adding one recently played using requests
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/player/recentlyPlayed',
      headers:{
        authorization: ''
      }
    })
    
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    playerController.addToRecentlyPlayed(request, response)
    response.on('end', async () => {
      try {
        const playHistoryAdded = await PlayHistory.findOne()
        expect(playHistoryAdded.context.type).toEqual('artist')
      } catch (error) {
        done(error)
      }
      const originalMaxRecentlyPlayed = parseInt(process.env.PLAY_HISTORY_MAX_COUNT, 10)
      process.env.PLAY_HISTORY_MAX_COUNT = 1
      await playerService.deleteOneRecentlyPlayedIfFull(userId)
      const playHistories = await PlayHistory.findOne()
      expect(playHistories).toEqual(null)
      process.env.PLAY_HISTORY_MAX_COUNT = originalMaxRecentlyPlayed
      done()
    })
  })

  // Testing getting recently played for a user
  it('Should return the recently played objects', async (done) => {
    //Generate context first to be able to use in recently played
    playerService = new playerServices()
    await playerService.generateContext(artistId, 'artist', userId)
    
    //Adding one recently played using requests
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/player/recentlyPlayed',
      headers:{
        authorization: ''
      }
    })
    
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    playerController.addToRecentlyPlayed(request, response)
    response.on('end', async () => {
      try {
        const playHistoryAdded = await PlayHistory.findOne()
        expect(playHistoryAdded.context.type).toEqual('artist')
      } catch (error) {
        done(error)
      }
      const request2 = httpMocks.createRequest({
        method: 'GET',
        url: 'me/player/recentlyPlayed',
        headers:{
          authorization: ''
        }
      })
      const response2 = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
      playerController.getRecentlyPlayed(request2,response2)
      response2.on('end', async() => {
        try {
          const body = await response2._getJSONData()
          expect(body.status).toBe('success')
          done()
        } catch (error) {
          done(error)
        }
      })
    })
  })
})
