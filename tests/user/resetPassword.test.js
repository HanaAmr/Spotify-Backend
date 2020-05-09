// /** Jest unit testing for resettig the password
//  * @module routes/users
//  * @requires express
//  */

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
const User = require('../../models/userModel')

/**
 * express module
 * User controller
 * @const
 */
const userController = require('../../controllers/userController')

/**
 * express module
 * User services
 * @const
 */
const userServices = require('../../services/userService')

/**
 * express module
 * Mailer services
 * @const
 */
const mailerServices = require('../../services/mailerService')

/**
 * express module
 * App error
 * @const
 */
const appError = require('../../utils/appError')

const mongoDB = process.env.DATABASE_LOCAL
// Connecting to the database
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!')
}

// Testing userService create token string function
describe('userService create token string functionality', () => {
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
    sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})
  })

  // Testing creating the token string without problems
  it('Should create the token string successfully', async () => {
    expect.assertions(2)
    const userService = new userServices()
    const token = await userService.createTokenString(20)
    expect(token).toHaveLength(20)
    expect(token).toBeDefined()
  })
})

// Testing assigning the token string for resetting password to a user
describe('userService assigning token string to user functionality', () => {
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
  it('Should assign the token string to an existing user successfully', async () => {
    expect.assertions(1)
    const userService = new userServices()
    const token = 'a random token'
    await userService.assignResetToken(token, 'omar@email.com')
    const user = await User.find({ email: 'omar@email.com', resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
    expect(user).toBeDefined()
  })

  // Testing assigning the token to a non existent user
  it('Shouldn\'t assign the token string as it\'s an non-existent user', async () => {
    const userService = new userServices()
    const token = 'a random token'
    await expect(userService.assignResetToken(token, 'wrongEmail@email.com')).rejects.toThrow(appError)
  })
})

// Testing mailerServie send email
describe('mailerServie send email functionality', () => {
  // Drop the whole users collection before testing and add a simple user to test with
  beforeEach(async () => {
    sinon.restore()
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    sinon.restore()
  })

  // Testing sending the email with no problems
  it('Should send the email successfully', async () => {
    const mailerService = new mailerServices()
    const email = 'testingmail@testingmail.com'
    const subject = 'testingsubject'
    const text = 'testingtext'
    await expect(mailerService.sendMail(email, subject, text)).resolves
  })
})

// Testing userService change password after reset
describe('userService change password after reset functionality', () => {
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
  it('Should change the password successfully', async () => {
    expect.assertions(1)
    const userService = new userServices()
    const token = 'atoken'
    const pass = 'testpassword'
    const passConf = 'testpassword'
    const oldPass = await User.findOne({ email: 'omar@email.com' }).select('password')
    await userService.resetChangePassword(token, pass, passConf)
    const newPass = await User.findOne({ email: 'omar@email.com' }).select('password')
    expect(oldPass.password).not.toEqual(newPass.password)
  })

  // Testing changing the password with non valid token
  it('Shouldn\'t change the password as token in invalid', async () => {
    const userService = new userServices()
    const token = 'nonvalidtoken'
    const pass = 'testpassword'
    const passConf = 'testpassword'
    await expect(userService.resetChangePassword(token, pass, passConf)).rejects.toThrow(appError)
  })

  // Testing changing the password with non matching passwords
  it('Shouldn\'t change passwords as passwords mismatch', async () => {
    const userService = new userServices()
    const token = 'atoken'
    const pass = 'testpassword1'
    const passConf = 'testpassword2'
    await expect(userService.resetChangePassword(token, pass, passConf)).rejects.toThrow(appError)
  })
})


//Integration testing

// Testing requesting for resetting password
describe('User can request to reset his password', () => {
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
    sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})
  })

  // Testing requesting to reset the password
  it('Should request to reset the password successfully and send email', done => {

    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/resetPassword',
      body: {
        email: 'omar@email.com'
      }
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    userController.requestResetPassword(request, response)
    response.on('end', () => {
      try {
        expect(response.statusCode).toEqual(204)
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

// Testing resetting password
describe('User can reset his password', () => {
  // Drop the whole users collection before testing and add a simple user to test with
  beforeEach(async () => {
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

  // Testing requesting to reset the password
  it('Should request to reset the password successfully and send email', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/resetPassword',
      params: {token: 'atoken'},
      body: {
        newPassword: 'newPassword',
        passwordConfirmation: 'newPassword'
      }
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    userController.resetPassword(request, response)
    response.on('end', async () => {
      try {
        expect(response.statusCode).toEqual(204)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

})
