const supertest = require('supertest')
const app = require('../../app')
const httpMocks = require('node-mocks-http')
const mongoose = require('mongoose')
const Playlist = require('../../models/playlistModel')
const Category = require('../../models/categoryModel')
const playlistController = require('../../controllers/playlistController')
const categoryController = require('../../controllers/categoryController')
const sinon = require('sinon')
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
const mongoDB = process.env.DATABASE_LOCAL
let server, agent

if (process.env.TEST === '1') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!')
}

let testCategory
describe('test getting categories', () => {
  beforeEach(async (done) => {
    sinon.restore()

    await mongoose.connection.collection('categories').deleteMany({})
    testCategory = new Category({
      _id: '5e8cfa46e91336067498160f',
      name: 'Pop',
      href: 'http://127.0.0.1:7000/browse/categories/5e8cfa46e91336067498160f/playlists'
    })

    await testCategory.save()

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
      createdAt: '2015-01-01',
      category: '5e8cfa46e91336067498160f'
    })

    await testPlaylist.save()

    server = app.listen(5010, (err) => {
      if (err) return done(err)

      agent = supertest.agent(server)
      done()
    })
  })

  afterEach(async (done) => {
    sinon.restore()
    await mongoose.connection.collection('playlists').deleteMany({})
    await mongoose.connection.collection('categories').deleteMany({})
    return server && server.close(done)
  })

  it('tests the get categories ', async (done) => {
    const response = await agent.get('/browse/categories')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.categories).not.toEqual(null)
    expect(response.body.data.categories[0]._id.toString()).toMatch(testCategory._id.toString())
    done()
  })

  it('tests the get category\'s playlists ', async () => {
    const response = await agent.get('/browse/categories/5e8cfa46e91336067498160f/playlists')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.data.playlists).not.toEqual(null)
    expect(response.body.data.playlists[0].category.toString()).toMatch(testCategory._id.toString())
  })

  it('Get categories\'s playlists given wrong id --> it should return error', done => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/browse/categories/5e8cfa46e91336067498160s/playlists'
    })

    const response = httpMocks.createResponse()
    categoryController.getCategoryPlaylist(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('No category found with that ID')

        done()
      } catch (error) {
        done(error)
      }
    })
  })
})
