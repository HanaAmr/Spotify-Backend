const supertest = require('supertest')
const app = require('./../../app')
const httpMocks = require('node-mocks-http')
const mongoose = require('mongoose')
const User = require('./../../models/userModel')
const Track = require('./../../models/trackModel')
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


describe('Like track functionality', () => {
    let authToken = ''
    let id = ''
    let trackId = ''
    let trackId2 = ''
    // Drop the whole collections before testing and add a simple user to test with
    beforeEach(async () => {
      await mongoose.connection.collection('users').deleteMany({})
      await mongoose.connection.collection('tracks').deleteMany({})


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

      
       const track = new Track({
        name: 'cry',
        trackNumber: 1,
        durationMs: 204000,
      })
      await track.save()
      trackId = track._id


      const track2 = new Track({
        name: 'laugh',
        trackNumber: 1,
        durationMs: 204000,
      })
      await track2.save()
      trackId2 = track2._id

      user.likedTracks.push(trackId2)
      await user.save()
    })
  
    //Drop the whole users collection after finishing testing
    afterAll(async () => {
      await mongoose.connection.collection('users').deleteMany({})
      await mongoose.connection.collection('tracks').deleteMany({})
    })
  
    
    // Testing like track successfully
    it('Should like track successfully', async () => {
        const response = await supertest(app).put('/me/likeTrack').send({
            id: trackId
        }).set('Authorization', authToken)
  
        expect(response.status).toBe(204)
    })



    it('Should not like track', done => {
    
      const request = httpMocks.createRequest({
        method: 'PUT',
        url: '/me/likeTrack',
        user: {
          id
      },
        body: {
            "id": id
        }
      })
  
      const response = httpMocks.createResponse()
      authContoller.likeTrack(request, response, (err) => {
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
   

    it('Should not like track', done => {
    
      const request = httpMocks.createRequest({
        method: 'PUT',
        url: '/me/likeTrack',
        user: {
          id
      },
        body: {
            "id": trackId2
        }
      })
  
      const response = httpMocks.createResponse()
      authContoller.likeTrack(request, response, (err) => {
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