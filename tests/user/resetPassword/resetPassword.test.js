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
// Configuring environment variables to use them
dotenv.config()

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
const User = require('../../../models/userModel')

/**
 * express module
 * User controller
 * @const
 */
const userController = require('../../../controllers/userController')

/**
 * express module
 * User middleware: reset password
 * @const
 */
const resetPasswordMiddleware = require('../../../middleware/user/resetPassword')

const mongoDB = process.env.DATABASE_LOCAL
// Connecting to the database
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!')
}

sinon.stub('')
// Testing userController create token string function
describe('userController create token string functionality', () => {
  // Drop the whole users collection before testing and add a simple user to test with
  beforeEach(async () => {
    await mongoose.connection.collection('users').deleteMany({})

    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password'
    })
    await validUser.save()
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
  })

  // Testing creating the token string without problems
  it('Should create the token string successfully', async (done) => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/resetPassword'
    })

    const response = httpMocks.createResponse()
    resetPasswordMiddleware.createTokenString(request, response, process.env.RESET_PASSWORD_TOKEN_SIZE, (err, req, res, token) => {
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
    await mongoose.connection.collection('users').deleteMany({})

    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password'
    })
    await validUser.save()
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})
  })

  // Testing successfully assigning the token to a user
  it('Should assign the token string to an existing user successfully', async (done) => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/resetPassword',
      body: {
        email: 'omar@email.com'
      }
    })
    const response = httpMocks.createResponse()
    const token = 'atoken'
    resetPasswordMiddleware.assignResetToken(request, response, token, (err, req, res, token, user) => {
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
  it('Shouldn\'t assign the token string as it\'s an non-existent user', async (done) => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/resetPassword',
      body: {
        email: 'omar22@email.com'
      }
    })
    const response = httpMocks.createResponse()
    const token = 'atoken'
    resetPasswordMiddleware.assignResetToken(request, response, token, (err, req, res, token, user) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing getting an error when searching for user with email in db
  it('Should receive an error when not able to search the db', async (done) => {
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
    resetPasswordMiddleware.assignResetToken(request, response, token, (err, req, res, token, user) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(500)
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})
// Testing userController send reset password email
describe('userController send reset password functionality', () => {
  // Drop the whole users collection before testing and add a simple user to test with
  beforeEach(async () => {
    sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})

    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password'
    })
    await validUser.save()
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})
  })

  // Testing sending the email with no problems
  it('Should send the email successfully', async (done) => {
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
    resetPasswordMiddleware.sendResetPasswordMail(request, response, token, user, (err) => {
      try {
        expect(err).not.toEqual(expect.anything())
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing failing to send the email with no problems
  it('Shouldn\'t send the email successfully', async (done) => {
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
    resetPasswordMiddleware.sendResetPasswordMail(request, response, token, user, (err) => {
      try {
        expect(err.statusCode).toEqual(502)
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
    await mongoose.connection.collection('users').deleteMany({})

    // Creating the valid user to assign the token to him
    const validUser = new User({
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
    await mongoose.connection.collection('users').deleteMany({})
  })

  // Testing changing the password with no problems
  it('Should change the password successfully', async (done) => {
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
    resetPasswordMiddleware.resetChangePassword(request, response, (err, req, res, user) => {
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
  it('Shouldn\'t change the password as token in invalid', async (done) => {
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
    resetPasswordMiddleware.resetChangePassword(request, response, (err, req, res, user) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(404)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing changing the password with non matching passwords
  it('Shouldn\'t change passwords as passwords mismatch', async (done) => {
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
    resetPasswordMiddleware.resetChangePassword(request, response, (err, req, res, user) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(403)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing changing the password with very short passwords
  it('Shouldn\'t change passwords as password is very short', async (done) => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/resetPassword/atoken',
      params: {
        token: 'atoken'
      },
      body: {
        newPassword: 'ok',
        passwordConfirmation: 'ok'
      }
    })

    const response = httpMocks.createResponse()
    resetPasswordMiddleware.resetChangePassword(request, response, (err, req, res, user) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(403)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing changing the password with error happening searching for user
  it('Shouldn\'t change password as error occurs when doing so', async (done) => {
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
    resetPasswordMiddleware.resetChangePassword(request, response, (err, req, res, user) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(500)
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
    await mongoose.connection.collection('users').deleteMany({})

    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password'
    })
    await validUser.save()
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})
  })

  // Testing sending the email with no problems
  it('Should send the email successfully', async (done) => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/resetPassword',
      headers: {
        host: 'dummyhost'
      }
    })

    const user = { email: 'omar@email.com' }
    const response = httpMocks.createResponse()
    resetPasswordMiddleware.sendSuccPasswordResetMail(request, response, user, (err) => {
      try {
        expect(err).not.toEqual(expect.anything())
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing failing to send the email confirming password reset with no problems
  it('Shouldn\'t send the email successfully', async (done) => {
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
    resetPasswordMiddleware.sendSuccPasswordResetMail(request, response, user, (err) => {
      try {
        expect(err.statusCode).toEqual(502)
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

//TODO:
// Testing userController whole send reset password email functionality
// describe('userController whole send reset password email functionality', () => {
//   // Drop the whole users collection before testing and add a simple user to test with
//   beforeEach(async () => {
//     sinon.restore()
//     await mongoose.connection.collection('users').deleteMany({})

//     // Creating the valid user to assign the token to him
//     const validUser = new User({
//       name: 'omar',
//       email: 'omar@email.com',
//       password: 'password'
//     })
//     await validUser.save()
//   })

//   // Drop the whole users collection after finishing testing
//   afterAll(async () => {
//     sinon.restore()
//     await mongoose.connection.collection('users').deleteMany({})
//   })

//   // Testing successful email to reset password
//   it('Should send 204 upon emailing to reset password', async (done) => {
//     const request = httpMocks.createRequest({
//       method: 'POST',
//       url: '/resetPassword',
//       body: {
//         email: 'omar@email.com'
//       }
//     })

//     const response = httpMocks.createResponse()
//      await userController.requestResetPassword(request, response)
//      expect(response.statusCode).toEqual(204)
//   })

//   // Testing unsuccessful reset password email request
//   it('Should send error upon failing to email to reset password', async (done) => {
//     const request = httpMocks.createRequest({
//       method: 'POST',
//       url: '/resetPassword',
//       body: {
//         email: 'omar22@email.com'
//       }
//     })

//     const response = httpMocks.createResponse()
//     userController.requestResetPassword(request, response, (err) => {
//       try {
//         expect(err).toEqual(expect.anything())
//         expect(err.statusCode).toEqual(404) // We're sending an unvalid email, so 404 not found would be returned from one of the middlewares.
//         done()
//       } catch (error) {
//         done(error)
//       }
//     })
//   })
// })

// // TODO: Testing userController whole reset password changing functionality 
// describe('userController whole reset password changing functionality', () => {
//   // Drop the whole users collection before testing and add a simple user to test with
//   beforeEach(async () => {
//     sinon.restore()
//     await mongoose.connection.collection('users').deleteMany({})

//     // Creating the valid user to assign the token to him
//     const validUser = new User({
//       name: 'omar',
//       email: 'omar@email.com',
//       password: 'oldpassword',
//       resetPasswordToken: 'atoken',
//       resetPasswordExpires: Date.now() + 36000
//     })
//     await validUser.save()
//   })

//   // Drop the whole users collection after finishing testing
//   afterAll(async () => {
//     sinon.restore()
//     await mongoose.connection.collection('users').deleteMany({})
//   })

//   // Testing successfully changing password via reset email
//   it('Should send 204 upon changing password (reset)', async (done) => {
//     const request = httpMocks.createRequest({
//       method: 'POST',
//       url: '/resetPassword/atoken',
//       params: {
//         token: 'atoken'
//       },
//       body: {
//         newPassword: 'password',
//         passwordConfirmation: 'password'
//       }
//     })

//     const response = httpMocks.createResponse()
//     userController.resetPassword(request, response)
//     expect(response.statusCode).toEqual(204)
//   })

//   // Testing unsuccessful change password by reset
//   it('Should send error upon failing to change password via reset email', async (done) => {
//     const request = httpMocks.createRequest({
//       method: 'POST',
//       url: '/resetPassword',
//       body: {
//         email: 'omar22@email.com'
//       }
//     })

//     const response = httpMocks.createResponse()
//     userController.resetPassword(request, response, (err) => {
//       try {
//         expect(err).toEqual(expect.anything())
//         expect(err.statusCode).toEqual(404)// We're sending an invalid email, so 404 not found would be returned from one of the middlewares.
//         done()
//       } catch (error) {
//         done(error)
//       }
//     })
//   })
// })
