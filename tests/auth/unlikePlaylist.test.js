const supertest = require('supertest')
const app = require('./../../app')
const httpMocks = require('node-mocks-http')
const mongoose = require('mongoose')
const User = require('./../../models/userModel')
const Playlist = require('./../../models/playlistModel')
const authContoller = require('./../../controllers/authController')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
const mongoDB = process.env.TEST_DATABASE

jest.setTimeout(10000)

if (process.env.TEST === '1') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!')
}


describe('Unike playlist functionality', () => {
    let authToken = ''
    let id = ''
    let playlistId = ''
    let playlistId2 = ''
    // Drop the whole collections before testing and add a simple user to test with
    beforeEach(async () => {
      await mongoose.connection.collection('users').deleteMany({})
      await mongoose.connection.collection('playlists').deleteMany({})


      // Creating a user to follow another user
      const user = new User({
        name: 'ahmed',
        email: 'ahmed@email.com',
        password: 'password',
        dateOfBirth: '1999-7-14',
        gender: 'male'
      })
      await user.save()
      // get the id of the document in the db to use it to get authorization token
      await User.findOne({}, (err, user) => {
        id = user._id
        authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
      })

      
      // Creating a user to be followed
       const playlist = new Playlist({
        name: 'Imagine Dragons Radio'
      })
      await playlist.save()
      playlistId = playlist._id
      
      playlist.owner = user
      await playlist.save()

      user.likedPlaylists.push(playlist._id)
      await user.save()


      const playlist2 = new Playlist({
        name: 'playlis2'
      })
      await playlist2.save()
      playlistId2 = playlist2._id
      playlist2.owner = user
      await playlist2.save()

    })
  
    //Drop the whole users collection after finishing testing
    afterAll(async () => {
      await mongoose.connection.collection('users').deleteMany({})
      await mongoose.connection.collection('playlists').deleteMany({})
    })
  
    
    // Testing unlike playlist successfully
    it('Should unlike playlist successfully', async () => {
        const response = await supertest(app).delete('/me/unlikePlaylist').send({
            id: playlistId
        }).set('Authorization', authToken)
  
        expect(response.status).toBe(204)
    })


    it('Should not unlike Playlist', done => {
    
      const request = httpMocks.createRequest({
        method: 'DELETE',
        url: '/me/unlikePlaylist',
        user: {
          id
      },
        body: {
            "id": id
        }
      })
  
      const response = httpMocks.createResponse()
      authContoller.unlikePlaylist(request, response, (err) => {
        try {
          expect(err).toEqual(expect.anything())
          expect(err.statusCode).toEqual(400)
          expect(err.status).toEqual('fail')
  
          done()
        } catch (error) {
          done(error)
        }
      })
    })
   

    it('Should not unlike Playlist', done => {
    
      const request = httpMocks.createRequest({
        method: 'DELETE',
        url: '/me/unlikePlaylist',
        user: {
          id
      },
        body: {
            "id": playlistId2
        }
      })
  
      const response = httpMocks.createResponse()
      authContoller.unlikePlaylist(request, response, (err) => {
        try {
          expect(err).toEqual(expect.anything())
          expect(err.statusCode).toEqual(400)
          expect(err.status).toEqual('fail')
  
          done()
        } catch (error) {
          done(error)
        }
      })
    })
   
})