const supertest = require('supertest')
const app = require('../../app')
const httpMocks = require('node-mocks-http')
const mongoose = require('mongoose')
const Playlist = require('../../models/playlistModel')
const Track = require('../../models/trackModel')
const Album = require('../../models/albumModel')
const User = require('../../models/userModel')
const sinon = require('sinon')
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
const mongoDB = process.env.TEST_DATABASE
const authController = require('./../../controllers/authController')
const jwt = require('jsonwebtoken')
let server, agent;
let authToken = 'token'
let authToken2 = 'token'
let id1


if (process.env.TEST === '1') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!')
}

let testPlaylist
describe('test getting library components', () => {
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

    await testPlaylist.save()

    await mongoose.connection.collection('albums').deleteMany({})
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
      totalTracks:2
    })
    await testAlbum.save()

    await mongoose.connection.collection('users').deleteMany({})
    const firstUser = new User({
        name: 'omar',
        email: 'omar@email.com',
        password: 'password',
    })
    await firstUser.save()
    id1 = firstUser._id

    const secondUser = new User({
        _id:'5e8cfa4b1493ec60bc89c971',
        name: 'ahmed',
        email: 'ahmed@email.com',
        password: 'password',
        dateOfBirth: '1999-7-14',
        gender: 'male',
        likedAlbums:['5e8cfa4b1493ec60bc89c970'],
        likedTracks:['5e8cfa4ffbfe6a5764b4238c'],
        likedPlaylists:['5e729d853d8d0a432c70b59c'],
        followers:[id1],
        following:[id1]
        })
    await secondUser.save()

    await User.findOne({}, (err, user) => {
        id='5e8cfa4b1493ec60bc89c971'
        authToken = 'Bearer ' + jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
    }) 

    await User.findOne({}, (err, user) => {
        id=id1
        authToken2 = 'Bearer ' + jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
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
    await mongoose.connection.collection('albums').deleteMany({})
    await mongoose.connection.collection('users').deleteMany({})
    return server && server.close(done);
  })

  
  it('Test the request to get users I follow', async () => {
    const response = await agent.get('/me/following').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.users[0]._id.toString()).toMatch(id1.toString())
  })


  it('Test the request to get users I follow when I dont have any followed users', done => {
    let request = httpMocks.createRequest({
      method: 'GET',
      url: '/me/following',
      headers: {
        'Authorization': authToken2
      }
    })
    request.user={}
    request.user.id=id1
    const response = httpMocks.createResponse()
    authController.getfollowedArtistUser(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('You did not follow any artist/user')

        done()
      } catch (error) {
        done(error)
      }
    })
  })



  it('Test the request to get users who followed me', async () => {
    const response = await agent.get('/me/followers').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.users[0]._id.toString()).toMatch(id1.toString())
  })

  it('Test the request to get users who followed me when I dont have any followers', done => {
    let request = httpMocks.createRequest({
      method: 'GET',
      url: '/me/followers',
      headers: {
        'Authorization': authToken2
      }
    })
    request.user={}
    request.user.id=id1
    const response = httpMocks.createResponse()
    authController.getUserfollowers(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('You do not have any followers')

        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('Test the request to get tracks I like', async () => {
    const response = await agent.get('/me/likedTracks').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.tracks[0]._id.toString()).toMatch(testTrack._id.toString())
  })

  it('Test the request to get liked tracks when I dont like any track', done => {
    let request = httpMocks.createRequest({
      method: 'GET',
      url: '/me/likedTracks',
      headers: {
        'Authorization': authToken2
      }
    })
    request.user={}
    request.user.id=id1
    const response = httpMocks.createResponse()
    authController.getLikedTracks(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('You did not like any track')

        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('Test the request to get albums I like', async () => {
    const response = await agent.get('/me/likedAlbums').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.albums[0]._id.toString()).toMatch(testAlbum._id.toString())
  })

  it('Test the request to get liked albums when I dont like any album', done => {
    let request = httpMocks.createRequest({
      method: 'GET',
      url: '/me/likedAlbums',
      headers: {
        'Authorization': authToken2
      }
    })
    request.user={}
    request.user.id=id1
    const response = httpMocks.createResponse()
    authController.getLikedAlbums(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('You did not like any album')

        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('Test the request to get playlists I like', async () => {
    const response = await agent.get('/me/likedPlaylists').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.playlists[0]._id.toString()).toMatch(testPlaylist._id.toString())
  })

  it('Test the request to get liked playlists when I dont like any playlist', done => {
    let request = httpMocks.createRequest({
      method: 'GET',
      url: '/me/likedPlaylists',
      headers: {
        'Authorization': authToken2
      }
    })
    request.user={}
    request.user.id=id1
    const response = httpMocks.createResponse()
    authController.getLikedPlaylists(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('You did not like any playlist')

        done()
      } catch (error) {
        done(error)
      }
    })
  })


})
