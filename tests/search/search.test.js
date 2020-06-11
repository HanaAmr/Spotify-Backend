const supertest = require('supertest')
const app = require('../../app')
const httpMocks = require('node-mocks-http')
const mongoose = require('mongoose')
const Playlist = require('../../models/playlistModel')
const Track = require('../../models/trackModel')
const playlistController = require('../../controllers/playlistController')
const trackController = require('../../controllers/trackController')
const searchController = require('../../controllers/searchController')
const sinon = require('sinon')
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
const mongoDB = process.env.TEST_DATABASE
let server, agent
const searchService = require('./../../services/searchService')

// jest.setTimeout(10000)

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

    server = app.listen(5010, (err) => {
      if (err) return done(err)

      agent = supertest.agent(server)
      done()
    })
  })
  afterEach(async (done) => {
    sinon.restore()
    await mongoose.connection.collection('tracks').deleteMany({})
    return server && server.close(done)
  })

  it('test searching with letter B', async () => {
    const tracks = await searchService('B')
    expect(tracks[0]._id.toString()).toMatch(testTrack._id.toString())
  })

  it('test searching with letter ver', async () => {
    const tracks = await searchService('ver')
    expect(tracks[0]._id.toString()).toMatch(testTrack._id.toString())
  })

  it('test searching with letter T', async () => {
    const tracks = await searchService('T')
    expect(tracks.length).toBe(0)
  })

  it('Integeration test on searching with letter "B"', async () => {
    const response = await agent.get('/search?q=B')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.results.items[0]._id.toString()).toMatch(testTrack._id.toString())
  })

  it('Integeration test on searching with letter "ver"', async () => {
    const response = await agent.get('/search?q=ver')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.results.items[0]._id.toString()).toMatch(testTrack._id.toString())
  })

  it('Integeration test on searching with letter "T"', async () => {
    const response = await agent.get('/search?q=T')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.results.total).toBe(0)
  })
})
