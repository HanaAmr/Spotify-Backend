const supertest = require('supertest')
const app = require('./../../app')
const httpMocks = require('node-mocks-http')
const mongoose = require('mongoose')
const User = require('./../../models/userModel')
const authContoller = require('./../../controllers/authController')
const notificationsService = require('../../services/notificationService')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const sinon = require('sinon')
dotenv.config({ path: '.env' })
const mongoDB = process.env.TEST_DATABASE

jest.setTimeout(10000)

if (process.env.TEST === '1') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!')
}


describe('unfollow user functionality', () => {
    let authToken = 'token'
    let id = 'testid'
    let id2 = ''
    let id3 = ''
    // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
      await mongoose.connection.collection('users').deleteMany({})
     // sinon.stub(notificationsService.prototype,'sendNotification').returns()
     // sinon.stub(notificationsService.prototype,'subscribeToTopic').returns()

      // Creating a user to unfollow another user
      const firstUser = new User({
        name: 'ahmed',
        email: 'ahmed@email.com',
        password: 'password',
        dateOfBirth: '1999-7-14',
        gender: 'male'
      })
      await firstUser.save()
      // get the id of the document in the db to use it to get authorization token
      await User.findOne({}, (err, user) => {
        id = user._id
        authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
      })

      
      // Creating a user to be unfollowed
       const secondUser = new User({
        name: 'omar',
        email: 'omar@email.com',
        password: 'password',
      })
      await secondUser.save()
      id2 = secondUser._id

      firstUser.following.push(secondUser._id)
      await firstUser.save()



      const thirdUser = new User({
        name: 'ali',
        email: 'ali@email.com',
        password: 'password',
      })
      await thirdUser.save()
      id3 = thirdUser._id

    })
  
    //Drop the whole users collection after finishing testing
    afterAll(async () => {
      await mongoose.connection.collection('users').deleteMany({})
      sinon.restore()
    })
  
    
    // Testing follow user successfully
    it('Should unfollow user successfully', async () => {
        const response = await supertest(app).delete('/me/following').send({
            id: id2
        }).set('Authorization', authToken)
  
        expect(response.status).toBe(204)
    })


    it('Should not unfollow user', done => {
    
      const request = httpMocks.createRequest({
        method: 'DELETE',
        url: '/me/following',
        user: {
          id
      },
        body: {
            "id": "5ed837386e30fe3278081114"
        }
      })
  
      const response = httpMocks.createResponse()
      authContoller.unfollowArtistUser(request, response, (err) => {
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
   

    it('Should not unfollow user', done => {
    
      const request = httpMocks.createRequest({
        method: 'DELETE',
        url: '/me/following',
        user: {
          id
      },
        body: {
            "id": id3
        }
      })
  
      const response = httpMocks.createResponse()
      authContoller.unfollowArtistUser(request, response, (err) => {
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