
const supertest = require('supertest')
const app = require('../../app')
const httpMocks = require('node-mocks-http')
const mongoose = require('mongoose')
const Track = require('../../models/trackModel')
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

//let testPlaylist
describe('test getting tracks', () => {
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

    server = app.listen(5030, (err) => {
      if (err) return done(err);

      agent = supertest.agent(server); 
      done();
    }); 
  })

  afterEach(async (done) => {
    sinon.restore()
    await mongoose.connection.collection('tracks').deleteMany({})
    return server && server.close(done);
  })

  it('tests the get track endpoint and have the same id returned', async () => {
    const response = await agent.get('/tracks/5e8cfa4ffbfe6a5764b4238c')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.track).not.toEqual(null)
    expect(response.body.data.track._id.toString()).toMatch(testTrack._id.toString())
  })

  it('Get a track given wrong id --> it should return error', done => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/tracks/5e8cfa4ffbfe6a5764b4238p'
    })

    const response = httpMocks.createResponse()
    trackController.getOneTrack(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('No track found with that ID')

        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('tests the get tracks endpoint and have the same id returned', async () => {
    const response = await agent.get('/tracks?_id=5e8cfa4ffbfe6a5764b4238c')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.tracks).not.toEqual(null)
    expect(response.body.data.tracks[0]._id.toString()).toMatch(testTrack._id.toString())
  })

  it('Get tracks given wrong ids --> it should return error', done => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/tracks?_id=5e8cfa4ffbfe6a5764b4238l'
    })

    const response = httpMocks.createResponse()
    trackController.getTracks(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.name).toEqual('CastError')
        expect(err.message).toEqual('Cast to ObjectId failed for value "5e8cfa4ffbfe6a5764b4238l" at path "_id" for model "Track"')

        done()
      } catch (error) {
        done(error)
      }
    })
  })


  
});


  
 




