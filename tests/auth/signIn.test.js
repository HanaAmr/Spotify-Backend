const supertest = require('supertest')
const app = require('./../../app')
const httpMocks = require('node-mocks-http')
const mongoose = require('mongoose')
const User = require('./../../models/userModel')
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


describe('Sign in functionality', () => {
    let authToken = 'token'
    let id = 'testid'
    // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
      await mongoose.connection.collection('users').deleteMany({})
  
      // Creating the valid user to assign the token to him
      const validUser = new User({
        name: 'ahmed',
        email: 'ahmed@email.com',
        password: 'password'
      })
      await validUser.save()
      // get the id of the document in the db to use it to get authorization token
      await User.findOne({"email": "ahmed@email.com"}, (err, user) => {
        id = user._id
        authToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
      })
    })
  
    // Drop the whole users collection after finishing testing
    afterAll(async () => {
      await mongoose.connection.collection('users').deleteMany({})
    })
  
    // Testing sign in successfully
    it('Should sign in successfully', async () => {
      const response = await supertest(app).post('/signIn').send({
          "email": "ahmed@email.com",
          "password": "password"
      })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('Success')
      expect(response.body.success).toBe(true)
      //expect(response.body.token).toBe(authToken)
    })


    it('Should not sign in due to incorrect email', done => {

        const request = httpMocks.createRequest({
          method: 'POST',
          url: '/signIn',
          body: {
          email: 'ahm@email.com',
          password: 'password'
          }
        })
    
        const response = httpMocks.createResponse()
        authContoller.signIn(request, response, (err) => {
          try {
            expect(err).toEqual(expect.anything())
            expect(err.statusCode).toEqual(401)
            expect(err.status).toEqual('fail')
            done()

          } catch (error) {
            done(error)
          }
        })
      })


      it('Should not sign in due to incorrect password', done => {

        const request = httpMocks.createRequest({
          method: 'POST',
          url: '/signIn',
          body: {
          email: 'ahmed@email.com',
          password: 'passworddd'
          }
        })
    
        const response = httpMocks.createResponse()
        authContoller.signIn(request, response, (err) => {
          try {
            expect(err).toEqual(expect.anything())
            expect(err.statusCode).toEqual(401)
            expect(err.status).toEqual('fail')
            done()

          } catch (error) {
            done(error)
          }
        })
      })


      it('Should not sign in due to email not provided', done => {

        const request = httpMocks.createRequest({
          method: 'POST',
          url: '/signIn',
          body: {
          password: 'password'
          }
        })
    
        const response = httpMocks.createResponse()
        authContoller.signIn(request, response, (err) => {
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

      it('Should not sign in due to password not provided', done => {

        const request = httpMocks.createRequest({
          method: 'POST',
          url: '/signIn',
          body: {
          email: 'ahmed@email.com'
          }
        })
    
        const response = httpMocks.createResponse()
        authContoller.signIn(request, response, (err) => {
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