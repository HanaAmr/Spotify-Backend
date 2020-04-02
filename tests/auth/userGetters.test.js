/** Jest unit testing for getting user data
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
 * mongoose for db management
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

// Testing userService get user id
describe('userService get user id functionality', () => {
    let authToken = 'token'
    let id = 'testid'
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

  // Testing getting user id successfully.
  it('Should get user id successfully', async () => {
    expect.assertions(1)
    const userService = new userServices()
    const userId = await userService.getUserId(authToken)
    expect(JSON.stringify(userId)).toEqual(JSON.stringify(id))
  })

  // Testing getting user id unsuccessfully.
  it('Shouldn\'t get user id successfully', async () => {
    const userService = new userServices()
    await expect(userService.getUserId('invalidtoken')).rejects.toThrow(appError)
  })

  
})

// Testing userService get user role
describe('userService get user role functionality', () => {
    let authToken = 'token'
    let id = 'testid'
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

  // Testing getting user role successfully.
  it('Should get user role successfully', async () => {
    expect.assertions(1)
    const userService = new userServices()
    const userRole = await userService.getUserRole(authToken)
    expect(userRole).toEqual('user')
  })

  // Testing getting user role unsuccessfully.
  it('Shouldn\'t get user role successfully', async () => {
    const userService = new userServices()
    await expect(userService.getUserRole('invalidtoken')).rejects.toThrow(appError)
  })

  
})

// Testing userService get user email
describe('userService get user email functionality', () => {
    let authToken = 'token'
    let id = 'testid'
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

  // Testing getting user email successfully.
  it('Should get user email successfully', async () => {
    expect.assertions(1)
    const userService = new userServices()
    const userMail = await userService.getUserMail(authToken)
    expect(userMail).toEqual('omar@email.com')
  })

  // Testing getting user email unsuccessfully.
  it('Shouldn\'t get user email successfully', async () => {
    const userService = new userServices()
    await expect(userService.getUserMail('invalidtoken')).rejects.toThrow(appError)
  })

  
})