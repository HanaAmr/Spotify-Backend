/** Jest unit testing for siging up
 * @module routes/users
 * @requires express
 */

/**
 * mocking requests
 * @const
 */
const httpMocks = require('node-mocks-http')

/**
 * dotenv for environment variables
 * @const
 */
const dotenv = require('dotenv')
/**
 * mongoose for db management
 * @const
 */
const mongoose = require('mongoose')

/**
 * express module
 * User model from the database
 * @const
 */
const user = require('../../models/userModel')

/**
 * express module
 * User controller
 * @const
 */
const authController = require('../../controllers/authController')

dotenv.config({ path: '.env' })

mongoose.connect(process.env.DATABASE_LOCAL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(console.log('DB is connected successfuly!'))

// Testing authController send signing up user
describe('authController send signing up user', () => {
  // Drop the whole users collection before testing and add a simple user to test with
  beforeEach(async () => {
    // sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    // sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})
  })

  // Testing signing up user with no problem
  test('Should sign up successfully', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/signUp',
      body: {
        name: 'ahmed',
        email: 'ahmed@gmail.com',
        password: 'password'
      }
    })

    const response = httpMocks.createResponse()

    authController.signUp(request, response, done)

    expect(response.statusCode).toBe(200)

    // const data = response._getJSONData
    // console.log(data.status);
    // expect(response.status).toEqual('Success');
    // expect(response.data.success).toEqual(true);
    done()
  })

  // Testing signing up fails because name is not provided
  test('Signing up should fails because name is not provided', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/signUp',
      body: {
        email: 'ahmed@gmail.com',
        password: 'pass'
      }
    })

    const response = httpMocks.createResponse()

    authController.signUp(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).not.toEqual(200)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing signing up fails because email is not provided
  test('Signing up should fails because email is not provided', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/signUp',
      body: {
        name: 'ahmed',
        password: 'pass'
      }
    })

    const response = httpMocks.createResponse()

    authController.signUp(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).not.toEqual(200)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing signing up fails because password is not provided
  test('Signing up should fails because password is not provided', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/signUp',
      body: {
        name: 'ahmed',
        email: 'ahmed@gmail.com'
      }
    })

    const response = httpMocks.createResponse()

    authController.signUp(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).not.toEqual(200)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing signing up fails because password is less than 8 characters
  test('Signing up should fails because password is less than 8 characters', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/signUp',
      body: {
        name: 'ahmed',
        email: 'ahmed@gmail.com',
        password: 'pass'
      }
    })

    const response = httpMocks.createResponse()

    authController.signUp(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).not.toEqual(200)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing signing up fails because password is more than 20 characters
  test('Signing up should fails because password is more than 20 characters', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/signUp',
      body: {
        name: 'ahmed',
        email: 'ahmed@gmail.com',
        password: 'passworddddddddddddddddddd'
      }
    })

    const response = httpMocks.createResponse()

    authController.signUp(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).not.toEqual(200)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing signing up fails because email is not valid
  test('Signing up should fails because email is not valid', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/signUp',
      body: {
        name: 'ahmed',
        email: 'ahmedgmail.com',
        password: 'pass'
      }
    })

    const response = httpMocks.createResponse()

    authController.signUp(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).not.toEqual(200)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing signing up fails because email already exists
  test('Signing up should fails because email already exists', done => {
    const testUser = authController.createUser('mohamed', 'ahmed@gmail.com', 'password')
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/signUp',
      body: {
        name: 'ahmed',
        email: 'ahmed@gmail.com',
        password: 'pass'
      }
    })

    const response = httpMocks.createResponse()

    authController.signUp(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).not.toEqual(200)
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})
