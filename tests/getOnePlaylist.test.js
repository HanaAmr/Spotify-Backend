const supertest = require('supertest')
const app = require('./../app')
const httpMocks = require('node-mocks-http')
const mongoose = require('mongoose')
const Playlist = require('./../models/playlistModel')
const playlistController = require('./../controllers/playlistController')
const sinon = require('sinon')
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
const mongoDB = process.env.DATABASE_LOCAL

  
jest.setTimeout(10000);

if (process.env.TEST === '1') {
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  } else {
    throw new Error('Can\'t connect to db, make sure you run in test environment!')
  }
  let testPlaylist
describe('test getting one playlist', () => {
    // Drop the whole playlists collection before testing and add a simple user to test with
    beforeEach(async () => {
    sinon.restore()
      await mongoose.connection.collection('playlists').deleteMany({})
      testPlaylist = new Playlist({
        _id: '5e729d853d8d0a432c70b59c',
        name: 'Imagine Dragons Radio',
        href: "http://127.0.0.1:7000/api/v1/playlists/5e729d853d8d0a432c70b59c",
        uri: "spotify:playlists:5e729d853d8d0a432c70b59c",
        owner: [
            "5e729e8b3d8d0a432c70b59d"
        ],
        images:['imagine-dragons.jpg']
      })
     
      await testPlaylist.save()
      console.log(testPlaylist)
    })
  
    // Drop the whole users collection after finishing testing
    afterAll(async (done) => {
        sinon.restore()
      await mongoose.connection.collection('playlists').deleteMany({})
    })
  
    
    it("tests the get playlist endpoint and have the same id returned", async () => {

		const response = await supertest(app).get('/api/v1/playlists/5e729d853d8d0a432c70b59c');

		expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.playlist).not.toEqual(null)
        expect(response.body.playlist._id.toString()).toMatch(testPlaylist._id.toString())
    });
    
    it('Get playlist given wrong id --> it returns error', done => {
        console.log('http')
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/playlists/5e729d853d8d0a432c70b59g'
      })

      console.log('i exited')
      const response = httpMocks.createResponse()
      playlistController.getOnePlaylist(request, response, (err) => {
        try {
            expect(err).toEqual(expect.anything())
            expect(err.statusCode).toEqual(404)
            expect(err.status).toEqual('fail')
            
          done()
        } catch (error) {
          done(error)
       
        }
      })
    })


    it('Get playlist image', done => {
        console.log('http 2')
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/playlists/5e729d853d8d0a432c70b59c/image',
      })

      console.log('i exited 2')
      const response = httpMocks.createResponse()
      console.log(response)
      //sinon.stub(playlistController, 'getOnePlaylist').yields(new Error('Couldn\'t search for playlist in db.'))
      playlistController.getPlaylistImage(request, response, (err) => {
        try {
        console.log(response.status)
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        //expect(response.body.playlist).not.toEqual(null)
       // expect(response.body.images).toMatch(testPlaylist.images)
            
          done()
        } catch (error) {
          done(error)
       
        }
      })
    })

   




  })

