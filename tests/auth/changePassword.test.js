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

describe('Change password functionality', () => {
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

  // Testing change password successfully
  it('Should change password successfully', async () => {
    const response = await supertest(app).put('/me/changePassword').send({
      passwordConfirmation: 'password',
      newPassword: 'password123'
    }).set('Authorization', authToken)

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('Should not change password due to incorrect current password', done => {
    const request = httpMocks.createRequest({
      method: 'PUT',
      url: '/me/changePassword',
      user: {
        id
      },
      body: {
        passwordConfirmation: 'passwordd',
        newPassword: 'password123'
      }
    })

    const response = httpMocks.createResponse()
    authContoller.changePassword(request, response, (err) => {
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

  it('Should not change password because current password not provided', done => {
    const request = httpMocks.createRequest({
      method: 'PUT',
      url: '/me/changePassword',
      user: {
        id
      },
      body: {
        newPassword: 'password123'
      }
    })

    const response = httpMocks.createResponse()
    authContoller.changePassword(request, response, (err) => {
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

  it('Should not change password because new password not provided', done => {
    const request = httpMocks.createRequest({
      method: 'PUT',
      url: '/me/changePassword',
      user: {
        id
      },
      body: {
        passwordConfirmation: 'passwordd'
      }
    })

    const response = httpMocks.createResponse()
    authContoller.changePassword(request, response, (err) => {
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
