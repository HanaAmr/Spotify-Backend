const supertest = require('supertest')
const app = require('../../app')
const httpMocks = require('node-mocks-http')
const mongoose = require('mongoose')
const Playlist = require('../../models/playlistModel')
const Track = require('../../models/trackModel')
const User = require('../../models/userModel')
const playlistController = require('../../controllers/playlistController')
const trackController = require('../../controllers/trackController')
const sinon = require('sinon')
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
const mongoDB = process.env.TEST_DATABASE
let server, agent;
const recommendationService = require('./../../services/recommendationService')
const authController = require('./../../controllers/authController')
const jwt = require('jsonwebtoken')
let authToken = 'token'


if (process.env.TEST === '1') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!')
}

let testPlaylist
describe('test getting playlist', () => {
  beforeEach(async (done) => {
    
    sinon.restore()

    await mongoose.connection.collection('tracks').deleteMany({})
    testTrack = new Track({
      _id: '5e8cfa4ffbfe6a5764b4238c',
      name: 'Believer',
      href: 'http://127.0.0.1:7000/tracks/5e8cfa4ffbfe6a5764b4238c',
      uri: 'spotify:tracks:5e8cfa4ffbfe6a5764b4238c',
      trackNumber: 1,
      durationMs: 200000
    })

    await testTrack.save()

    testTrack2 = new Track({
      _id: '5e8cfa4ffbfe6a5764b4238d',
      name: 'Thunder',
      href: 'http://127.0.0.1:7000/tracks/5e8cfa4ffbfe6a5764b4238d',
      uri: 'spotify:tracks:5e8cfa4ffbfe6a5764b4238d',
      trackNumber: 1,
      durationMs: 200000
    })

    await testTrack2.save()

    await mongoose.connection.collection('playlists').deleteMany({})
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
      createdAt: '2015-01-01'
    })

    testPlaylist2 = new Playlist({
      _id: '5e8cfa54b90c6060e809d649',
      name: '21 Pilots',
      href: 'http://127.0.0.1:7000/playlists/5e8cfa54b90c6060e809d649',
      uri: 'spotify:playlists:5e8cfa54b90c6060e809d649',
      owner: [
        '5e729e8b3d8d0a432c70b59d'
      ],
      images: ['21_pilots.jpg'],
      popularity :100,
      createdAt: '2012-01-01'
    })

    await testPlaylist.save()
    await testPlaylist2.save()

    await mongoose.connection.collection('users').deleteMany({})
    const firstUser = new User({
        _id:'5e8cfa4b1493ec60bc89c971',
        name: 'omar',
        email: 'omar@email.com',
        password: 'password',
    })
    await firstUser.save()

    await User.findOne({}, (err, user) => {
      id='5e8cfa4b1493ec60bc89c971'
      authToken = 'Bearer ' + jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
    }) 
    

    server = app.listen(5010, (err) => {
    if (err) return done(err);

    agent = supertest.agent(server); 
    done();
    });
   
  })


  afterEach(async (done) => {
    sinon.restore()
    await mongoose.connection.collection('playlists').deleteMany({})
    await mongoose.connection.collection('tracks').deleteMany({})
    await mongoose.connection.collection('users').deleteMany({})
    return server && server.close(done);
  })

  it('tests the get playlist endpoint and have the same id returned', async () => {
    const response = await agent.get('/playlists/5e729d853d8d0a432c70b59c')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.playlist).not.toEqual(null)
    expect(response.body.data.playlist._id.toString()).toMatch(testPlaylist._id.toString())
  })


  it('Get playlist given wrong id --> it should return error', done => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/playlists/5e729d853d8d0a432c70b59g'
    })

    const response = httpMocks.createResponse()
    playlistController.getOnePlaylist(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('No playlist found with that ID')

        done()
      } catch (error) {
        done(error)
      }
    })
  })


  it('Get playlist image', async () => {
    const response = await agent.get('/playlists/5e729d853d8d0a432c70b59c/image')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.images).not.toEqual(null)
    expect(response.body.data.images.images.toString()).toMatch(testPlaylist.images.toString())
  })

  it('Get playlist image given wrong id --> it should return error', done => {

    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/playlists/5e729d853d8d0a432c70b59g/image'
    })

    const response = httpMocks.createResponse()
    playlistController.getOnePlaylist(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('No playlist found with that ID')


        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('Get playlist tracks', async () => {
    const response = await agent.get('/playlists/5e729d853d8d0a432c70b59c/tracks')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.tracksArray).not.toEqual(null)
    expect(response.body.data.tracksArray[0]._id.toString()).toMatch(testTrack._id.toString())
  })

  it('Get playlist tracks given wrong id --> it should return error', done => {

    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/playlists/5e729d853d8d0a432c70b59g/tracks'
    })

    const response = httpMocks.createResponse()
    playlistController.getOnePlaylist(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('No playlist found with that ID')


        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('Get sorted playlists by popularity', async () => {
    const response = await agent.get('/playlists/top?sort=-popularity')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.playlist).not.toEqual(null)
    expect(response.body.data.playlist[0]._id.toString()).toMatch(testPlaylist2._id.toString())
    expect(response.body.data.playlist[1]._id.toString()).toMatch(testPlaylist._id.toString())
  })

  it('Get sorted playlists by createdAt date', async () => {
    const response = await agent.get('/playlists/top?sort=-createdAt')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.playlist).not.toEqual(null)
    expect(response.body.data.playlist[0]._id.toString()).toMatch(testPlaylist._id.toString())
    expect(response.body.data.playlist[1]._id.toString()).toMatch(testPlaylist2._id.toString())
  })


  it('Test getting recommended tracks for playlist checking that existing track will not be returned', async () => {
    const tracks = await recommendationService("5e729d853d8d0a432c70b59c")
    expect(tracks.excludeTracks[0]._id.toString()).toMatch(testTrack._id.toString())
    expect(tracks.limit).toBe(3)
    expect(tracks.page).toBe(1)
  })

  it('Test getting recommended tracks for an empty playlist', async () => {
    const tracks = await recommendationService("5e8cfa54b90c6060e809d649")
    expect(tracks.excludeTracks.length).toBe(0)
    expect(tracks.limit).toBe(3)
    expect(tracks.page).toBe(1)
  })

  it('Get recommended playlists', async () => {
    const response = await agent.get('/playlists/recommended').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.playlist).not.toEqual(null)
    expect(response.body.data.playlist.length).toBe(2)
  })
  
})
