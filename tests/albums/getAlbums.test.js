const supertest = require('supertest')
const app = require('../../app')
const httpMocks = require('node-mocks-http')
const mongoose = require('mongoose')
const Album = require('../../models/albumModel')
const Track = require('../../models/trackModel')
const albumController = require('../../controllers/albumController')
const trackController = require('../../controllers/trackController')
const sinon = require('sinon')
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
const mongoDB = process.env.DATABASE_LOCAL
let server, agent;


if (process.env.TEST === '1') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!')
}

let testPlaylist
describe('test getting albums', () => {
  beforeEach(async (done) => {
    
    sinon.restore()

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
      releaseDate: '2018-01-01'
    })

    await testAlbum.save()

    testAlbum2 = new Album({
        _id: '5e8cfa4c1493ec60bc89c971',
        name: 'Divide',
        href: 'http://127.0.0.1:7000/albums/5e8cfa4c1493ec60bc89c971',
        uri: 'spotify:albums:5e8cfa4c1493ec60bc89c971',
        popularity: 20,
        releaseDate: '2015-01-01',
        type: 'album',
        albumType: 'single',
        releaseDate: '2020-01-01'
      })
  
      await testAlbum2.save()


    await mongoose.connection.collection('tracks').deleteMany({})
    testTrack = new Track({
      _id: '5e8cfa4ffbfe6a5764b4238c',
      name: 'Believer',
      href: 'http://127.0.0.1:7000/tracks/5e8cfa4ffbfe6a5764b4238c',
      uri: 'spotify:tracks:5e8cfa4ffbfe6a5764b4238c',
      trackNumber: 1,
      durationMs: 200000,
      album: '5e8cfa4b1493ec60bc89c970'
    })

    await testTrack.save()


    server = app.listen(5010, (err) => {
    if (err) return done(err);

    agent = supertest.agent(server); 
    done();
    });
   
  })


  afterEach(async (done) => {
    sinon.restore()
    await mongoose.connection.collection('albums').deleteMany({})
    await mongoose.connection.collection('tracks').deleteMany({})
    return server && server.close(done);
  })

  it('tests the get albums endpoint and have the same ids returned', async () => {
    const response = await agent.get('/albums?_id=5e8cfa4b1493ec60bc89c970,5e8cfa4c1493ec60bc89c971')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.albums).not.toEqual(null)
    expect(response.body.data.albums[0]._id.toString()).toMatch(testAlbum._id.toString())
    expect(response.body.data.albums[1]._id.toString()).toMatch(testAlbum2._id.toString())
  })

  it('Get albums given wrong ids --> it should return error', done => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/albums?_id=5e8cfa4b1493ec60bc89c978,5e8cfa4c1493ec60bc89c975'
    })

    const response = httpMocks.createResponse()
    albumController.getAlbumsWithIds(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('No albums found with those IDs')

        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('tests the get album endpoint and have the same id returned', async () => {
    const response = await agent.get('/albums/5e8cfa4b1493ec60bc89c970')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.album).not.toEqual(null)
    expect(response.body.data.album._id.toString()).toMatch(testAlbum._id.toString())
  })


  it('Get album given wrong id --> it should return error', done => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/albums/5e8cfa4b1493ec60bc89c972'
    })

    const response = httpMocks.createResponse()
    albumController.getOneAlbum(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('No album found with that ID')

        done()
      } catch (error) {
        done(error)
      }
    })
  })



  it('Get album tracks', async () => {
    const response = await agent.get('/albums/5e8cfa4b1493ec60bc89c970/tracks')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.tracksArray).not.toEqual(null)
    expect(response.body.data.tracksArray[0]._id.toString()).toMatch(testTrack._id.toString())
  })

  it('Get album tracks given wrong id --> it should return error', done => {

    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/albums/5e8cfa4b1493ec60bc89c971/tracks'
    })

    const response = httpMocks.createResponse()
    albumController.getOneAlbum(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('No album found with that ID')



        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('Get sorted albums by popularity', async () => {
    const response = await agent.get('/albums/top?sort=-popularity')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.albums).not.toEqual(null)
    expect(response.body.data.albums[0]._id.toString()).toMatch(testAlbum._id.toString())
    expect(response.body.data.albums[1]._id.toString()).toMatch(testAlbum2._id.toString())
  })

  it('Get sorted albums by release date', async () => {
    const response = await agent.get('/albums/top?sort=-releaseDate')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.albums).not.toEqual(null)
    expect(response.body.data.albums[0]._id.toString()).toMatch(testAlbum2._id.toString())
    expect(response.body.data.albums[1]._id.toString()).toMatch(testAlbum._id.toString())
  })

})
