/** Jest unit testing for becoming premium
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
 * sinon
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
 * User services
 * @const
 */
const userServices = require('../../services/userService')

/**
 * express module
 * error object
 * @const
 */
const appError = require('../../utils/appError')

const mongoDB = process.env.DATABASE_LOCAL
// Connecting to the database
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!' + process.env.NODE_ENV)
}

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
    await User.findOne({}, (err, user) => {
      const id = user._id
      authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
    })
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
    await User.findOne({}, (err, user) => {
      const id = user._id
      authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
    })
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
    await User.findOne({}, (err, user) => {
      const id = user._id
      authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
    })
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
