/** Jest unit testing for resettig the password
 * @module routes/users
 * @requires express
 */

/**
 * sinon
 * @const
 */
const sinon = require('sinon')
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
const User = require('../../../models/user')

/**
 * express module
 * User controller
 * @const
 */
const userController = require('../../../controllers/userController')

// Configuring environment variables to use them
dotenv.config()
const mongoDB = process.env.MONGO_URI
// Connecting to the database
if (process.env.TEST === '1') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!')
}
// Testing userController create token string function
describe('userController create token string functionality', () => {
  // Drop the whole users collection before testing and add a simple user to test with
  beforeEach(async () => {
    await mongoose.connection.dropCollection('users', () => {
    })

    // Creating the valid user to assign the token to him
    const validUser = new User({
      id: 'idvalid',
      name: 'omar',
      email: 'omar@email.com',
      password: 'password'
    })
    await validUser.save()
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    await mongoose.connection.dropCollection('users', () => {
    })
  })

  // Testing creating the token string without problems
  it('Should create the token string successfully', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/resetPassword'
    })

    const response = httpMocks.createResponse()
    userController.createTokenString(request, response, (err, req, res, token) => {
      try {
        expect(err).not.toEqual(expect.anything())
        expect(token).toBeDefined()
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

// Testing assigning the token string for resetting password to a user
describe('userController assigning token string to user functionality', () => {
  // Drop the whole users collection before testing and add a simple user to test with
  beforeEach(async () => {
    sinon.restore()
    await mongoose.connection.dropCollection('users', () => {
    })

    // Creating the valid user to assign the token to him
    const validUser = new User({
      id: 'idvalid',
      name: 'omar',
      email: 'omar@email.com',
      password: 'password'
    })
    await validUser.save()
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    sinon.restore()
    await mongoose.connection.dropCollection('users', () => {
    })
  })

  // Testing successfully assigning the token to a user
  it('Should assign the token string to an existing user successfully', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/resetPassword',
      body: {
        email: 'omar@email.com'
      }
    })
    const response = httpMocks.createResponse()
    const token = 'atoken'
    userController.assignUserResetToken(request, response, token, (err, req, res, token, user) => {
      try {
        expect(err).not.toEqual(expect.anything())
        expect(user).toBeDefined()
        expect(user.resetPasswordToken).toEqual(token)
        done()
      } catch (error) {
        done(error)
      }
    })
  })
  // Testing assigning the token to a non existent user
  it('Shouldn\'t assign the token string as it\'s an non-existent user', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/resetPassword',
      body: {
        email: 'omar22@email.com'
      }
    })
    const response = httpMocks.createResponse()
    const token = 'atoken'
    userController.assignUserResetToken(request, response, token, (err, req, res, token, user) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(user).not.toBeDefined()
        expect(response.statusCode).toEqual(404)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing getting an error when searching for user with email in db
  it('Should receive an error when not able to search the db', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/resetPassword',
      body: {
        email: 'omar@email.com'
      }
    })
    const response = httpMocks.createResponse()
    const token = 'atoken'
    sinon.stub(User, 'findOne').yields(new Error('Couldn\'t search for user in db.'))
    userController.assignUserResetToken(request, response, token, (err, req, res, token, user) => {
      try {
        expect(err).toEqual(expect.anything())
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing userController send reset password email
  describe('userController send reset password functionality', () => {
  // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
      sinon.restore()
      await mongoose.connection.dropCollection('users', () => {
      })

      // Creating the valid user to assign the token to him
      const validUser = new User({
        id: 'idvalid',
        name: 'omar',
        email: 'omar@email.com',
        password: 'password'
      })
      await validUser.save()
    })

    // Drop the whole users collection after finishing testing
    afterAll(async () => {
      sinon.restore()
      await mongoose.connection.dropCollection('users', () => {
      })
    })

    // Testing sending the email with no problems
    it('Should send the email successfully', done => {
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/resetPassword',
        headers: {
          host: 'dummyhost'
        }
      })

      const user = { email: 'omar@email.com' }
      const token = 'atoken'
      const response = httpMocks.createResponse()
      userController.sendResetPasswordEmail(request, response, token, user, (err) => {
        try {
          expect(err).not.toEqual(expect.anything())
          done()
        } catch (error) {
          done(error)
        }
      })
    })

    // Testing failing to send the email with no problems
    it('Shouldn\'t send the email successfully', done => {
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/resetPassword',
        headers: {
          host: 'dummyhost'
        }
      })

      const transport = {
        sendMail: (data, callback) => {
          const err = new Error('Error with sendMail from transport!')
          callback(err, null)
        }
      }
      sinon.stub(userController.nodemailer, 'createTransport').returns(transport)
      const user = { email: 'omar@email.com' }
      const token = 'atoken'
      const response = httpMocks.createResponse()
      userController.sendResetPasswordEmail(request, response, token, user, (err) => {
        try {
          expect(response.statusCode).toEqual(502)
          done()
        } catch (error) {
          done(error)
        }
      })
    })
  })

  // Testing userController change password after reset
  describe('userController change password after reset functionality', () => {
  // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
      sinon.restore()
      await mongoose.connection.dropCollection('users', () => {
      })

      // Creating the valid user to assign the token to him
      const validUser = new User({
        id: 'idvalid',
        name: 'omar',
        email: 'omar@email.com',
        password: 'password',
        resetPasswordToken: 'atoken',
        resetPasswordExpires: Date.now() + 360000
      })
      await validUser.save()
    })

    // Drop the whole users collection after finishing testing
    afterAll(async () => {
      sinon.restore()
      await mongoose.connection.dropCollection('users', () => {
      })
    })

    // Testing changing the password with no problems
    it('Should change the password successfully', done => {
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/resetPassword/atoken',
        params: {
          token: 'atoken'
        },
        body: {
          newPassword: 'password',
          passwordConfirmation: 'password'
        }
      })

      const response = httpMocks.createResponse()
      userController.changePasswordReset(request, response, (err, req, res, user) => {
        try {
          expect(err).not.toEqual(expect.anything())
          expect(user.resetPasswordToken).not.toEqual(expect.anything)
          done()
        } catch (error) {
          done(error)
        }
      })
    })

    // Testing changing the password with non valid token
    it('Shouldn\'t change the password as token in invalid', done => {
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/resetPassword/atoken',
        params: {
          token: 'atokensdsd'
        },
        body: {
          newPassword: 'password',
          passwordConfirmation: 'password'
        }
      })

      const response = httpMocks.createResponse()
      userController.changePasswordReset(request, response, (err, req, res, user) => {
        try {
          expect(err).toEqual(expect.anything())
          expect(response.statusCode).toEqual(404)
          done()
        } catch (error) {
          done(error)
        }
      })
    })

    // Testing changing the password with non matching passwords
    it('Shouldn\'t change passwords as passwords mismatch', done => {
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/resetPassword/atoken',
        params: {
          token: 'atoken'
        },
        body: {
          newPassword: 'passwordsss',
          passwordConfirmation: 'password'
        }
      })

      const response = httpMocks.createResponse()
      userController.changePasswordReset(request, response, (err, req, res, user) => {
        try {
          expect(err).toEqual(expect.anything())
          expect(response.statusCode).toEqual(403)
          done()
        } catch (error) {
          done(error)
        }
      })
    })

    // Testing changing the password with error happening searching for user
    it('Shouldn\'t change password as error occurs when doing so', done => {
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/resetPassword/atoken',
        params: {
          token: 'atoken'
        },
        body: {
          newPassword: 'passwordsss',
          passwordConfirmation: 'password'
        }
      })

      const response = httpMocks.createResponse()
      sinon.stub(User, 'findOne').yields(new Error('Couldn\'t search for user in db.'))
      userController.changePasswordReset(request, response, (err, req, res, user) => {
        try {
          expect(err).toEqual(expect.anything())
          expect(response.statusCode).toEqual(500)
          done()
        } catch (error) {
          done(error)
        }
      })
    })
  })

  // Testing userController send password successfull reset email
  describe('userController send successfull reset password functionality', () => {
  // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
      sinon.restore()
      await mongoose.connection.dropCollection('users', () => {
      })

      // Creating the valid user to assign the token to him
      const validUser = new User({
        id: 'idvalid',
        name: 'omar',
        email: 'omar@email.com',
        password: 'password'
      })
      await validUser.save()
    })

    // Drop the whole users collection after finishing testing
    afterAll(async () => {
      sinon.restore()
      await mongoose.connection.dropCollection('users', () => {
      })
    })

    // Testing sending the email with no problems
    it('Should send the email successfully', done => {
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/resetPassword',
        headers: {
          host: 'dummyhost'
        }
      })

      const user = { email: 'omar@email.com' }
      const response = httpMocks.createResponse()
      userController.sendSuccPassResetEmail(request, response, user, (err) => {
        try {
          expect(err).not.toEqual(expect.anything())
          done()
        } catch (error) {
          done(error)
        }
      })
    })

    // Testing failing to send the email confirming password reset with no problems
    it('Shouldn\'t send the email successfully', done => {
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/resetPassword',
        headers: {
          host: 'dummyhost'
        }
      })

      const transport = {
        sendMail: (data, callback) => {
          const err = new Error('Error with sendMail from transport!')
          callback(err, null)
        }
      }
      sinon.stub(userController.nodemailer, 'createTransport').returns(transport)
      const user = { email: 'omar@email.com' }
      const response = httpMocks.createResponse()
      userController.sendSuccPassResetEmail(request, response, user, (err) => {
        try {
          expect(response.statusCode).toEqual(502)
          done()
        } catch (error) {
          done(error)
        }
      })
    })
  })

  // Testing userController whole send reset password email functionality
  describe('userController whole send reset password email functionality', () => {
  // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
      sinon.restore()
      await mongoose.connection.dropCollection('users', () => {
      })

      // Creating the valid user to assign the token to him
      const validUser = new User({
        id: 'idvalid',
        name: 'omar',
        email: 'omar@email.com',
        password: 'password'
      })
      await validUser.save()
    })

    // Drop the whole users collection after finishing testing
    afterAll(async () => {
      sinon.restore()
      await mongoose.connection.dropCollection('users', () => {
      })
    })

    // Testing successful email to reset password
    it('Should send 204 upon emailing to reset password', done => {
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/resetPassword',
        body: {
          email: 'omar@email.com'
        }
      })

      const response = httpMocks.createResponse()
      userController.resetPasswordSendMail(request, response, (err) => {
        try {
          expect(response.statusCode).toEqual(204)
          done()
        } catch (error) {
          done(error)
        }
      })
    })

    // Testing unsuccessful reset password email request
    it('Should send 500 upon failing to email to reset password', done => {
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/resetPassword',
        body: {
          email: 'omar22@email.com'
        }
      })

      const response = httpMocks.createResponse()
      userController.resetPasswordSendMail(request, response, (err) => {
        try {
          expect(response.statusCode).toEqual(500)
          done()
        } catch (error) {
          done(error)
        }
      })
    })
  })

  // Testing userController whole reset password changing functionality
  describe('userController whole reset password changing functionality', () => {
  // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
      sinon.restore()
      await mongoose.connection.dropCollection('users', () => {
      })

      // Creating the valid user to assign the token to him
      const validUser = new User({
        id: 'idvalid',
        name: 'omar',
        email: 'omar@email.com',
        password: 'oldpassword',
        resetPasswordToken: 'atoken',
        resetPasswordExpires: Date.now() + 36000
      })
      await validUser.save()
    })

    // Drop the whole users collection after finishing testing
    afterAll(async () => {
      sinon.restore()
      await mongoose.connection.dropCollection('users', () => {
      })
    })

    // Testing successfully changing password via reset email
    it('Should send 204 upon changing password (reset)', done => {
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/resetPassword/atoken',
        params: {
          token: 'atoken'
        },
        body: {
          newPassword: 'password',
          passwordConfirmation: 'password'
        }
      })

      const response = httpMocks.createResponse()
      userController.resetPassword(request, response, (err) => {
        try {
          expect(response.statusCode).toEqual(204)
          done()
        } catch (error) {
          done(error)
        }
      })
    })

    // Testing unsuccessful change password by reset
    it('Should send 500 upon failing to change password via reset email', done => {
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/resetPassword',
        body: {
          email: 'omar22@email.com'
        }
      })

      const response = httpMocks.createResponse()
      userController.resetPassword(request, response, (err) => {
        try {
          expect(response.statusCode).toEqual(500)
          done()
        } catch (error) {
          done(error)
        }
      })
    })
  })
})
