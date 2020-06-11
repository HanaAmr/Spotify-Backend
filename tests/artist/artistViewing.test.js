// /** Jest unit testing for functions related to artist viewing
//  * @module routers/artistRoutes
//  * @requires express
//  */

/**
 * express module
 * app that contains server endpoints
 * @const
 */
const app = require('../../app')

/**
 * express module
 * Album model from the database
 * @const
 */
const Album = require('../../models/albumModel')

/**
 * express module
 * Album model from the database
 * @const
 */
const Track = require('../../models/trackModel')

/**
 * express module
 * User model from the database
 * @const
 */
const User = require('../../models/userModel')
const Playlist = require('../../models/playlistModel')

/**
 * express module
 * controller responsible for artist routes
 * @const
 */
const artistViewingController = require('../../controllers/artistViewingController')
/**
 * SuperTest package
 * @const
 */
const supertest = require('supertest')

/**
 * Mongoose
 * @const
 */
const mongoose = require('mongoose')

/**
 * sinon test framework
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
dotenv.config({ path: '.env' })
// database name
const mongoDB = process.env.TEST_DATABASE
let server, agent

if (process.env.TEST === '1') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!')
}

// Test artists endpoints
let testartistViewing
describe('test getting a single artist', () => {
  beforeEach(async (done) => {
    sinon.restore()

    await mongoose.connection.collection('user').deleteMany({})
    testArtist = new User({
      _id: '5e8cfa4ffbfe6a5764b4238c',
      name: 'Queen',
      email: 'Queen@gmail.com',
      href: 'http://127.0.0.1:7000/users/5e8cfa4ffbfe6a5764b4238c',
      uri: 'spotify:users:5e8cfa4ffbfe6a5764b4238c',
      role: 'artist',
      password: '12378211',
      role: 'artist',
      artistInfo:
        {
          genres: ['rock']
        }
    })
    await testArtist.save()

    testArtist1 = new User({
      _id: '5e7402f608ca0a685d89bbc2',
      name: 'Guns N roses',
      email: 'gunsandroses@gmail.com',
      href: 'http://127.0.0.1:7000/users/5e7402f608ca0a685d89bbc2',
      uri: 'spotify:users:5e7402f608ca0a685d89bbc2',
      role: 'artist',
      password: '12assaa378211',
      artistInfo:
        {
          genres: ['rock', 'hard rock']
        }
    })
    await testArtist1.save()

    testArtist2 = new User({
      _id: '5e721f6f9d44b25581a41b5d',
      name: 'AC/DC',
      email: 'acdc@gmail.com',
      href: 'http://127.0.0.1:7000/users/5e721f6f9d44b25581a41b5d',
      uri: 'spotify:users:5e721f6f9d44b25581a41b5d',
      role: 'artist',
      password: '1232278211',
      artistInfo:
        {
          genres: ['rock']
        }
    })
    await testArtist2.save()

    testArtist3 = new User({
      _id: '5e88aa247a5804327d51b9be',
      name: 'Sia',
      email: 'sia@gmail.com',
      href: 'http://127.0.0.1:7000/users/5e88aa247a5804327d51b9be',
      uri: 'spotify:users:5e88aa247a5804327d51b9be',
      role: 'artist',
      password: 'newpass2sss2',
      artistInfo:
        {
          genres: ['pop', 'Electropo']
        }
    })
    await testArtist3.save()

    await mongoose.connection.collection('playlists').deleteMany({})
    testPlaylist = new Playlist({
      _id: '5e729d853d8d0a432c70b59c',
      name: 'Imagine Dragons Radio',
      href: 'http://127.0.0.1:7000/playlists/5e729d853d8d0a432c70b59c',
      uri: 'spotify:playlists:5e729d853d8d0a432c70b59c',
      owner: [
        '5e88aa247a5804327d51b9be'
      ],
      images: ['imagine-dragons.jpg'],
      trackObjects: ['5e8cfa4ffbfe6a5764b4238c'],
      popularity: 60,
      createdAt: '2015-01-01'
    })
    await testPlaylist.save()

    testUser = new User({
      _id: '5e8cc89b2749544e1cdf62f0',
      name: 'ahmed',
      email: 'ahmedWael@gmail.com',
      href: 'http://127.0.0.1:7000/users/5e8cc89b2749544e1cdf62f0',
      uri: 'spotify:users:5e8cc89b2749544e1cdf62f0',
      role: 'user',
      password: '12378211'
    })
    await testUser.save()

    await mongoose.connection.collection('albums').deleteMany({})
    testAlbum = new Album({
      _id: '5e8cfa4b1493ec60bc89c970',
      name: 'A Night at the Opera',
      href: 'http://127.0.0.1:7000/albums/5e8cfa4b1493ec60bc89c970',
      uri: 'spotify:albums:5e8cfa4b1493ec60bc89c970',
      popularity: 6089,
      releaseDate: '2015-01-01',
      type: 'album',
      albumType: 'single',
      releaseDate: '2018-01-01',
      totalTracks: 12,
      artists: ['5e8cfa4ffbfe6a5764b4238c']
    })

    await testAlbum.save()

    testAlbum2 = new Album({
      _id: '5e86027b7fa893263b2b75e9',
      name: 'Hot Space',
      href: 'http://127.0.0.1:7000/albums/5e8cfa4c1493ec60bc89c971',
      uri: 'spotify:albums:5e8cfa4c1493ec60bc89c971',
      popularity: 2000,
      releaseDate: '2015-01-01',
      type: 'album',
      albumType: 'single',
      releaseDate: '2020-01-01',
      totalTracks: 11,
      artists: ['5e8cfa4ffbfe6a5764b4238c']
    })

    await testAlbum2.save()

    testAlbum3 = new Album({
      _id: '5e8cfa4c1493ec60bc89c971',
      name: 'Oldies',
      href: 'http://127.0.0.1:7000/albums/5e8cfa4c1493ec60bc89c971',
      uri: 'spotify:albums:5e8cfa4c1493ec60bc89c971',
      popularity: 2000,
      releaseDate: '2015-01-01',
      type: 'album',
      albumType: 'single',
      releaseDate: '2020-01-01',
      totalTracks: 0,
      artists: ['5e8cfa4ffbfe6a5764b4238c']
    })

    await testAlbum3.save()

    testAlbum4 = new Album({
      _id: '5e8d0d2fa5f7907240ef4b8f',
      name: 'Breath',
      href: 'http://127.0.0.1:7000/albums/5e8d0d2fa5f7907240ef4b8f',
      uri: 'spotify:albums:5e8d0d2fa5f7907240ef4b8f',
      popularity: 2000,
      releaseDate: '2015-01-01',
      type: 'album',
      albumType: 'single',
      releaseDate: '2020-01-01',
      totalTracks: 5
    })
    await testAlbum4.save()

    const testTrack = new Track({
      _id: '5e753c8ec4ec0b101b899631',
      name: 'bohemian rhapsody',
      type: 'track',
      trackNumber: 2,
      durationMs: 187000,
      popularity: 300000,
      album: '5e8cfa4b1493ec60bc89c970',
      artists: ['5e8cfa4ffbfe6a5764b4238c'],
      audioFilePath: 'tracks/track2.mp3'

    })
    await testTrack.save()

    const testTrack1 = new Track({
      _id: '5e8d366e02fa080d81b856fc',
      name: 'Love Of My Life',
      type: 'track',
      trackNumber: 3,
      durationMs: 187000,
      popularity: 300000,
      album: '5e8cfa4b1493ec60bc89c970',
      artists: ['5e8cfa4ffbfe6a5764b4238c'],
      audioFilePath: 'tracks/track2.mp3'

    })
    await testTrack1.save()

    server = app.listen(5010, (err) => {
      if (err) return done(err)

      agent = supertest.agent(server)
      done()
    })
  })

  afterEach(async (done) => {
    sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('tracks').deleteMany({})
    await mongoose.connection.collection('albums').deleteMany({})
    await mongoose.connection.collection('playlists').deleteMany({})

    return server && server.close(done)
  })

  // integration testing to to test that get artist endpoint returns the same id passed in the params and that role is artist
  it('tests the get artist endpoint and have the artist of same id returned', async () => {
    const response = await agent.get('/artists/5e8cfa4ffbfe6a5764b4238c')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data).not.toEqual(null)
    expect(response.body.data.artist.role).toEqual('artist')
    expect(response.body.data.artist._id.toString()).toMatch('5e8cfa4ffbfe6a5764b4238c')
  })

  // integration testing to test get artist endpoint when passing a normal user
  it('tests the get artist endpoint when passing a normal user id', done => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/artists/5e8cc89b2749544e1cdf62f0',
      params: {
        id: '5e8cc89b2749544e1cdf62f0'
      }
    })
    const response = httpMocks.createResponse()
    artistViewingController.getArtist(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('No artist with such an ID')

        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // integration testing to to test that get artists endpoint returns a list of artists
  it('tests the get artists end point to return artists only', async () => {
    const response = await agent.get('/artists')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data).not.toEqual(null)
    for (index = 0; index < response.body.data.length; index++) { expect(response.body.data[index].role).toEqual('artist') }
  })

  // integration testing to to test that get related artists endpoint returns a list of artists who have the same genre
  it('tests the get related artists end point to return only artists having the same genres', async () => {
    const response = await agent.get('/artists/5e8cfa4ffbfe6a5764b4238c/related-artists')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data).not.toEqual(null)
    for (index = 0; index < response.body.data.length; index++) {
      expect(response.body.data[index].role).toEqual('artist')
      expect(response.body.data[index].artistInfo.genres).toEqual(expect.arrayContaining(['rock']))
    }
  })

  // TODO::
  // integration testing to test get related artist endpoint when passed artist has no matching artists
  it('tests the get related artist endpoint when passed artist has no matching artists', done => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/artists/5e88aa247a5804327d51b9be/related-artists/',
      params:
        {
          id: '5e88aa247a5804327d51b9be'
        }
    })

    const response = httpMocks.createResponse()
    artistViewingController.getRelatedArtists(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('No related artists found for this artist!')

        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('tests that get albums endpoint returns only albums of passed artist', async () => {
    const response = await agent.get('/artists/5e8cfa4ffbfe6a5764b4238c/albums')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data).not.toEqual(null)
    for (index = 0; index < response.body.data.length; index++) {
      expect(response.body.data[index].totalTracks).not.toEqual(0)
      expect(response.body.data[index].artists).toEqual(expect.arrayContaining([{ _id: '5e8cfa4ffbfe6a5764b4238c', artistInfo: { genres: ['rock'] }, externalUrls: [''], followers: [], href: 'http://127.0.0.1:7000/users/5e8cfa4ffbfe6a5764b4238c', images: ['https://totallynotspotify.codes/public/imgs/users/default.jpg'], name: 'Queen', role: 'artist', uri: 'spotify:users:5e8cfa4ffbfe6a5764b4238c', userStats: [] }]))
    }
  })

  it('tests that get artist albums returns error if artist has empty albums or no albums at all', done => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/artists/5e88aa247a5804327d51b9be/albums',
      params: {
        id: '5e88aa247a5804327d51b9be'
      }
    })

    const response = httpMocks.createResponse()
    artistViewingController.getArtistAlbums(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('No albums for this artist!')

        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('tests that get top tracks endpoint return tacks of the passed artist only', async () => {
    const response = await agent.get('/artists/5e8cfa4ffbfe6a5764b4238c/top-tracks')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data).not.toEqual(null)
    for (index = 0; index < response.body.data.length; index++) { expect(response.body.data[index].artists).toEqual(expect.arrayContaining([{ _id: '5e8cfa4ffbfe6a5764b4238c', artistInfo: { genres: ['rock'] }, externalUrls: [''], followers: [], href: 'http://127.0.0.1:7000/users/5e8cfa4ffbfe6a5764b4238c', images: ['https://totallynotspotify.codes/public/imgs/users/default.jpg'], name: 'Queen', role: 'artist', uri: 'spotify:users:5e8cfa4ffbfe6a5764b4238c', userStats: [] }])) }
  })

  it('tests that get artist albums returns error if artist has empty albums or no albums at all', done => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/artists/5e721f6f9d44b25581a41b5d/top-tracks',
      params:
        {
          id: '5e721f6f9d44b25581a41b5d'
        }
    })

    const response = httpMocks.createResponse()
    artistViewingController.getArtistTopTracks(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('No tracks for artist')

        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('tests that get playlists endpoint returns only playlists of passed artist', async () => {
    const response = await agent.get('/artists/5e88aa247a5804327d51b9be/created-playlists')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data).not.toEqual(null)
    expect(response.body.data[0]._id.toString()).toMatch(testPlaylist._id.toString())
  })

  it('tests that get playlists endpoint returns only playlists of passed artist if the artist did not create any playlist', done => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/artists/5e7402f608ca0a685d89bbc2/created-playlists',
      params:
      {
        id: '5e7402f608ca0a685d89bbc2'
      }
    })

    const response = httpMocks.createResponse()
    artistViewingController.getArtistCreatedPlaylists(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('No created playlists for artist')

        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('tests that get playlists endpoint returns only playlists of passed artist if the artist did not create any playlist', done => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/artists/5e8cc89b2749544e1cdf62f0/created-playlists',
      params:
      {
        id: '5e8cc89b2749544e1cdf62f0'
      }
    })

    const response = httpMocks.createResponse()
    artistViewingController.getArtistCreatedPlaylists(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('No artist with such an ID')

        done()
      } catch (error) {
        done(error)
      }
    })
  })
})
