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


describe('Sign up functionality', () => {
    let authToken = 'token'
    let id = 'testid'
    // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
      await mongoose.connection.collection('users').deleteMany({})
  
      // Creating the valid user to assign the token to him
      const validUser = new User({
        name: 'mohamed',
        email: 'mohamed@email.com',
        password: 'password'
      })
      await validUser.save()
      // get the id of the document in the db to use it to get authorization token
      await User.findOne({"email": "mohamed@email.com"}, (err, user) => {
        id = user._id
        authToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
      })
    })
  
    // Drop the whole users collection after finishing testing
    afterAll(async () => {
      await mongoose.connection.collection('users').deleteMany({})
    })
  
    // Testing sign up successfully
    it('Should sign up successfully', async () => {
      const response = await supertest(app).post('/signUp').send({
          "email": "ahmed@email.com",
          "password": "password",
          "name": "ahmed",
          "dateOfBirth": "1999-7-14",
          "gender": "male"
      })


      expect(response.status).toBe(200)
      expect(response.body.status).toBe('Success')
      expect(response.body.success).toBe(true)
      //expect(response.body.token).toBe(authToken)
    })


    it('Should not sign up because email is not valid', done => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/signUp',
            body: {
              "email": "ahmedemail.com",
              "password": "password",
              "name": "ahmed",
              "dateOfBirth": "1999-7-14",
              "gender": "male"
            }
          })
    
        
        const response = httpMocks.createResponse()
        authContoller.signUp(request, response, (err) => {
          try {
            expect(err).toEqual(expect.anything())
            expect(err.name).toEqual('ValidationError')
            done()

          } catch (error) {
            done(error)
          }
        })
      })


      it('Should not sign up because email is not provided', done => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/signUp',
            body: {
              "password": "password",
              "name": "ahmed",
              "dateOfBirth": "1999-7-14",
              "gender": "male"
            }
          })
    
        const response = httpMocks.createResponse()
        authContoller.signUp(request, response, (err) => {
          try {
            expect(err).toEqual(expect.anything())
            expect(err.name).toEqual('ValidationError')
            done()

          } catch (error) {
            done(error)
          }
        })
      })


      it('Should not sign up because email already exist', done => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/signUp',
            body: {
              "email": "mohamed@email.com",
              "password": "password",
              "name": "ahmed",
              "dateOfBirth": "1999-7-14",
              "gender": "male"
            }
          })
    
        const response = httpMocks.createResponse()
        authContoller.signUp(request, response, (err) => {
          try {
            expect(err).toEqual(expect.anything())
            expect(err.name).toEqual('MongoError')
            done()

          } catch (error) {
            done(error)
          }
        })
      })


      it('Should not sign up because name is not provided', done => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/signUp',
            body: {
              "email": "ahmed@email.com",
              "password": "password",
              "dateOfBirth": "1999-7-14",
              "gender": "male"
            }
          })
    
        const response = httpMocks.createResponse()
        authContoller.signUp(request, response, (err) => {
          try {
            expect(err).toEqual(expect.anything())
            expect(err.name).toEqual('ValidationError')
            done()

          } catch (error) {
            done(error)
          }
        })
      })


      it('Should not sign up because password is less than 8 digits', done => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/signUp',
            body: {
              "email": "ahmed@email.com",
              "password": "pass",
              "name": "ahmed",
              "dateOfBirth": "1999-7-14",
              "gender": "male"
            }
          })
    
        const response = httpMocks.createResponse()
        authContoller.signUp(request, response, (err) => {
          try {
            expect(err).toEqual(expect.anything())
            expect(err.name).toEqual('ValidationError')
            done()

          } catch (error) {
            done(error)
          }
        })
      })


      it('Should not sign up because password is greater than 20 digits', done => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/signUp',
            body: {
              "email": "ahmed@email.com",
              "password": "passwordddddddddddddddddddd",
              "name": "ahmed",
              "dateOfBirth": "1999-7-14",
              "gender": "male"
            }
          })
    
        const response = httpMocks.createResponse()
        authContoller.signUp(request, response, (err) => {
          try {
            expect(err).toEqual(expect.anything())
            expect(err.name).toEqual('ValidationError')
            done()

          } catch (error) {
            done(error)
          }
        })
      })


      it('Should not sign up because his age is birthDate after 2020-01-01', done => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/signUp',
            body: {
              "email": "ahmedgmail.com",
              "password": "password",
              "name": "ahmed",
              "dateOfBirth": "2030-7-14",
              "gender": "male"
            }
          })
    
        const response = httpMocks.createResponse()
        authContoller.signUp(request, response, (err) => {
          try {
            expect(err).toEqual(expect.anything())
            expect(err.name).toEqual('ValidationError')
            done()

          } catch (error) {
            done(error)
          }
        })
      })


     

  })