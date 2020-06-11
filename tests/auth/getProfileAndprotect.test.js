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

describe('Get my profile functionality', () => {
  let authToken = 'token'
  let id = 'testid'
  // Drop the whole users collection before testing and add a simple user to test with
  beforeEach(async () => {
    await mongoose.connection.collection('users').deleteMany({})

    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'ahmed',
      email: 'ahmed@email.com',
      password: 'password',
      dateOfBirth: '1999-7-14',
      gender: 'male'
    })
    await validUser.save()
    // get the id of the document in the db to use it to get authorization token
    await User.findOne({}, (err, user) => {
      id = user._id
      authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
    })
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
  })

  // Testing getting user profile successfully.
  it('Should get user profile successfully', async () => {
    const response = await supertest(app).get('/me').set('Authorization', authToken)

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('ahmed')
    expect(response.body.email).toBe('ahmed@email.com')
    expect(response.body.gender).toBe('male')
    expect(response.body.dateOfBirth).toBe('1999-7-14')
  })

  it('Should not get user profile because token not provided', done => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/me'
    })

    const response = httpMocks.createResponse()
    authContoller.protect(request, response, (err) => {
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

  it('Should not get user profile because token is incorrect', done => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/me',
      headers: {
        authorization: 'incorrect token'
      }
    })

    const response = httpMocks.createResponse()
    authContoller.protect(request, response, (err) => {
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
})
