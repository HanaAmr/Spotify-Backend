// /** Jest unit testing for becoming premium
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
 * JWT
 * @const
 */
const jwt = require('jsonwebtoken')

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
 * Mailer services
 * @const
 */
const mailerServices = require('../../services/mailerService')

/**
 * express module
 * error object
 * @const
 */
const appError = require('../../utils/appError')

const mongoDB = process.env.TEST_DATABASE
// Connecting to the database
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

// Testing assigning the config code for upgrade to user
describe('userService assigning config code to user functionality', () => {
  // the authorization token needed to test
  var authToken = 'testToken'
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
    // get the id of the document in the db to use it to get authorization token
    const svdUsr = await User.findOne({})
    const id = svdUsr._id
    authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})
  })

  // Testing successfully assigning the config code to a user
  it('Should assign the confiramtion code to an existing user successfully', async () => {
    expect.assertions(1)
    const userService = new userServices()
    const token = 'a random token'
    await userService.assignUpgradeConfirmCode(authToken, token, 'premium')
    const user = await User.find({ email: 'omar@email.com', upgradeToken: token, upgradeTokenExpires: { $gt: Date.now() } })
    expect(user).toBeDefined()
  })
  // Testing assigning the token to a non existent user
  it('Shouldn\'t assign the token string as it\'s an non-existent user', async () => {
    const userService = new userServices()
    const token = 'a random token'
    // making authToken invalid
    const id = mongoose.Types.ObjectId()
    authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
    await expect(userService.assignUpgradeConfirmCode(authToken, token, 'premium')).rejects.toThrow(appError)
  })
})

// Testing userService change user role after confirming upgrade code
describe('userService change user role after confirming upgrade code', () => {
  // the authorization token needed to test
  var authToken = 'testToken'
  // Drop the whole users collection before testing and add a simple user to test with
  beforeEach(async () => {
    sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})
    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password',
      upgradeToken: 'atoken',
      upgradeTokenExpires: Date.now() + 360000,
      upgradeRole: 'premium'
    })
    await validUser.save()
    // get the id of the document in the db to use it to get authorization token
    const svdUsr = await User.findOne({})
    const id = svdUsr._id
    authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})
  })

  // Testing changing the role with valid confirmation code
  it('Should change the role to premium successfully', async () => {
    expect.assertions(1)
    const userService = new userServices()
    await userService.upgradeUserRole(authToken, 'atoken')
    const user = await User.findOne({ email: 'omar@email.com', role: 'premium' })
    expect(user.role).toEqual('premium')
  })

  // Testing changing the role to premium with non valid confirmation code
  it('Should change the role to premium successfully', async () => {
    const userService = new userServices()
    await expect(userService.upgradeUserRole(authToken, 'notvalid')).rejects.toThrow(appError)
  })
})

// Testing userService change user role to normal after confirming cancellation code
describe('userService change user role to normal after confirming cancellation code', () => {
  // the authorization token needed to test
  var authToken = 'testToken'
  // Drop the whole users collection before testing and add a simple user to test with
  beforeEach(async () => {
    sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})
    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password',
      role: 'premium',
      upgradeToken: 'atoken',
      upgradeTokenExpires: Date.now() + 360000,
      upgradeRole: 'premium'
    })
    await validUser.save()
    // get the id of the document in the db to use it to get authorization token
    const svdUsr = await User.findOne({})
    const id = svdUsr._id
    authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})
  })

  // Testing changing the role with valid confirmation code
  it('Should change the role to premium successfully', async () => {
    expect.assertions(1)
    const userService = new userServices()
    await userService.changeRoleToUser(authToken, 'atoken')
    const user = await User.findOne({ email: 'omar@email.com', role: 'user' })
    expect(user.role).toEqual('user')
  })

  // Testing changing the role to premium with non valid confirmation code
  it('Should change the role to premium successfully', async () => {
    const userService = new userServices()
    await expect(userService.changeRoleToUser(authToken, 'notvalid')).rejects.toThrow(appError)
  })
})

// Integration testing

// Testing requesting for upgrading to become premium/artist
describe('User can request to upgrade', () => {
  let userId
  // Drop the whole users collection before testing and add a simple user to test with
  beforeEach(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    sinon.restore()
    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password'
    })
    await validUser.save()
    userId = validUser._id
    // Stub the functions that uses authorization
    sinon.stub(require('../../controllers/authController'), 'protect').returns(() => { })
    sinon.stub(userServices.prototype, 'getUserId').returns(userId)
    sinon.stub(userServices.prototype, 'getUserMail').returns(validUser.email)
    // stubbing mailing functions
    sinon.stub(mailerServices.prototype, 'sendMail').returns()
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    sinon.restore()
  })

  // Testing requesting to become premium
  it('Should request to become premium successfully', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/premium',
      body: {
        email: 'omar@email.com'
      },
      headers: {
        authorization: jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
      }
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    userController.requestBecomePremium(request, response)
    response.on('end', async () => {
      try {
        const user = await User.findOne({ email: 'omar@email.com' })
        expect(user.upgradeRole).toEqual('premium')
        expect(response.statusCode).toEqual(204)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  // Testing requesting to become artist
  it('Should request to become artist successfully', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/artist',
      body: {
        email: 'omar@email.com'
      },
      headers: {
        authorization: jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
      }
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    userController.requestBecomeArtist(request, response)
    response.on('end', async () => {
      try {
        const user = await User.findOne({ email: 'omar@email.com' })
        expect(user.upgradeRole).toEqual('artist')
        expect(response.statusCode).toEqual(204)
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

// Testing confirming the upgrading to become premium/artist
describe('User can confirm that he/she wants to upgrade', () => {
  let userId
  // Drop the whole users collection before testing and add a simple user to test with
  beforeEach(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    sinon.restore()
    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password',
      upgradeRole: 'premium',
      upgradeToken: 'atoken',
      upgradeTokenExpires: Date.now() + 36000
    })
    await validUser.save()
    userId = validUser._id
    // Stub the functions that uses authorization
    sinon.stub(require('../../controllers/authController'), 'protect').returns(() => { })
    sinon.stub(userServices.prototype, 'getUserId').returns(userId)
    sinon.stub(userServices.prototype, 'getUserMail').returns(validUser.email)
    sinon.stub(userServices.prototype, 'getUserRole').returns(() => {
      const user = User.findOne({ email: 'omar@email.com' })
      return user.role
    })
    // stubbing mailing functions
    sinon.stub(mailerServices.prototype, 'sendMail').returns()
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    sinon.restore()
    await mongoose.connection.collection('users').deleteMany({})
  })

  // Testing confirming to upgrade to premium
  it('Should confirm upgrading to become premium successfully', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/upgrade',
      body: {
        email: 'omar@email.com'
      },
      headers: {
        authorization: jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
      },
      params: {
        confirmationCode: 'atoken'
      }
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    userController.confirmUpgrade(request, response)
    response.on('end', async () => {
      try {
        const user = await User.findOne({ email: 'omar@email.com' })
        expect(user.role).toEqual('premium')
        expect(response.statusCode).toEqual(204)
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

// Testing requesting for cancling the upgrade
describe('User can request to cancel upgrade', () => {
  let userId
  // Drop the whole users collection before testing and add a simple user to test with
  beforeEach(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    sinon.restore()
    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password',
      role: 'premium'
    })
    await validUser.save()
    userId = validUser._id
    // Stub the functions that uses authorization
    sinon.stub(require('../../controllers/authController'), 'protect').returns(() => { })
    sinon.stub(userServices.prototype, 'getUserId').returns(userId)
    sinon.stub(userServices.prototype, 'getUserMail').returns(validUser.email)
    sinon.stub(userServices.prototype, 'getUserRole').returns(() => {
      const user = User.findOne({ email: 'omar@email.com' })
      return user.role
    })
    // stubbing mailing functions
    sinon.stub(mailerServices.prototype, 'sendMail').returns()
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    sinon.restore()
  })

  // Testing requesting to cancel premium
  it('Should request to cancel premium successfully', done => {
    const request = httpMocks.createRequest({
      method: 'DELETE',
      url: '/me/premium',
      body: {
        email: 'omar@email.com'
      },
      headers: {
        authorization: jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
      }
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    userController.cancelUpgrade(request, response)
    response.on('end', async () => {
      try {
        const user = await User.findOne({ email: 'omar@email.com' })
        expect(user.upgradeRole).toEqual('user')
        expect(response.statusCode).toEqual(204)
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

// Testing confirming cancelling the upgrad
describe('User can confirm that he/she wants to cancel the upgrade', () => {
  let userId
  // Drop the whole users collection before testing and add a simple user to test with
  beforeEach(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    sinon.restore()
    // Creating the valid user to assign the token to him
    const validUser = new User({
      name: 'omar',
      email: 'omar@email.com',
      password: 'password',
      userRole: 'premium',
      upgradeRole: 'premium',
      upgradeToken: 'atoken',
      upgradeTokenExpires: Date.now() + 36000
    })
    await validUser.save()
    userId = validUser._id
    // Stub the functions that uses authorization
    sinon.stub(require('../../controllers/authController'), 'protect').returns(() => { })
    sinon.stub(userServices.prototype, 'getUserId').returns(userId)
    sinon.stub(userServices.prototype, 'getUserMail').returns(validUser.email)
    sinon.stub(userServices.prototype, 'getUserRole').returns(() => {
      const user = User.findOne({ email: 'omar@email.com' })
      return user.role
    })
    // stubbing mailing functions
    sinon.stub(mailerServices.prototype, 'sendMail').returns()
  })

  // Drop the whole users collection after finishing testing
  afterAll(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    sinon.restore()
  })

  // Testing confirming to cancel the upgrade
  it('Should confirm cancelling the upgrade', done => {
    const request = httpMocks.createRequest({
      method: 'DELETE',
      url: '/me/upgrade',
      body: {
        email: 'omar@email.com'
      },
      headers: {
        authorization: jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
      },
      params: {
        confirmationCode: 'atoken'
      }
    })

    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
    userController.confirmCancelUpgrade(request, response)
    response.on('end', async () => {
      try {
        const user = await User.findOne({ email: 'omar@email.com' })
        expect(user.role).toEqual('user')
        expect(response.statusCode).toEqual(204)
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})
