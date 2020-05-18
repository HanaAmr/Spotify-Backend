// /** Jest unit testing for notifications services.
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
 * Notification model from the database
 * @const
 */
const Notification = require('../../models/notificationModel')

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
 * Notifications services
 * @const
 */
const notificationsServices = require('../../services/notificationService')

/**
 * express module
 * App error
 * @const
 */
const appError = require('../../utils/appError')

const mongoDB = process.env.TEST_DATABASE
// Connecting to the database
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })


// Testing updating user notifications token 
describe('notificationService update token functionality', () => {
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
        //stub functions that need authorization
        sinon.stub(userServices.prototype, 'getUserId').returns(validUser._id)
        sinon.stub(require('../../controllers/authController'), 'protect').returns(() => { })
    })

    // Drop the whole users collection after finishing testing
    afterAll(async () => {
        sinon.restore()
        await mongoose.connection.collection('users').deleteMany({})
    })

    // Testing updating web token
    it('Should update the web notifications token successfully', async () => {
        expect.assertions(1)
        const notificationService = new notificationsServices()
        const token = "new token"
        await notificationService.updateToken("", 'web', token)
        const usr = await User.findOne({ "email": "omar@email.com" })
        expect(usr.webNotifToken).toEqual("new token")
    })

    // Testing updating android token
    it('Should update the android notifications token successfully', async () => {
        expect.assertions(1)
        const notificationService = new notificationsServices()
        const token = "new token"
        await notificationService.updateToken("", 'android', token)
        const usr = await User.findOne({ "email": "omar@email.com" })
        expect(usr.androidNotifToken).toEqual("new token")
    })

    //Testing updating with an invalid type
    it(`Shouldn't update the token as type is invalid`, async () => {
        const notificationService = new notificationsServices()
        const token = 'a random token'
        await expect(notificationService.updateToken("", 'ios', token)).rejects.toThrow(appError)
    })
})

// Testing Getting user notifications token 
describe('notificationService getting notification tokens functionality', () => {
    // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
        sinon.restore()
        await mongoose.connection.collection('users').deleteMany({})

        // Creating the valid user to assign the token to him
        const validUser = new User({
            name: 'omar',
            email: 'omar@email.com',
            password: 'password',
            webNotifToken: 'webToken',
            androidNotifToken: 'androidToken'
        })
        await validUser.save()
        //stub functions that need authorization
        sinon.stub(userServices.prototype, 'getUserId').returns(validUser._id)
        sinon.stub(require('../../controllers/authController'), 'protect').returns(() => { })
    })

    // Drop the whole users collection after finishing testing
    afterAll(async () => {
        sinon.restore()
        await mongoose.connection.collection('users').deleteMany({})
    })

    // Testing getting tokens
    it('Should update the web notifications token successfully', async () => {
        expect.assertions(2)
        const notificationService = new notificationsServices()
        const tokens = await notificationService.getToken("")
        expect(tokens[0]).toEqual('webToken')
        expect(tokens[1]).toEqual('androidToken')
    })

})

// Testing Generating notifications object 
describe('notificationService generate notification tokens functionality', () => {
    // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
        sinon.restore()
    })

    // Drop the whole users collection after finishing testing
    afterAll(async () => {
        sinon.restore()
    })

    // Testing generating notifications object
    it('Should generate notifications object successfully', async () => {
        expect.assertions(4)
        const notificationService = new notificationsServices()
        const message = await notificationService.generateNotification("Hello", "Hi", "1234") //Message sent using firebase
        const notif = await Notification.findOne({"userId":"1234"})  //Notification added in db
        expect(notif.notification.title).toEqual('Hello')
        expect(notif.notification.body).toEqual('Hi')
        expect(message.notification.title).toEqual('Hello')
        expect(message.notification.body).toEqual('Hi')
    })

})

// Testing Sending notificaton
describe('notificationService sending notification functionality', () => {
    // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
        sinon.restore()
        await mongoose.connection.collection('users').deleteMany({})

        // Creating the valid user to assign the token to him
        const validUser = new User({
            name: 'omar',
            email: 'omar@email.com',
            password: 'password',
            webNotifToken: 'webToken',
            androidNotifToken: 'androidToken'
        })
        await validUser.save()
        //stub functions that need authorization
        sinon.stub(userServices.prototype, 'getUserId').returns(validUser._id)
        sinon.stub(require('../../controllers/authController'), 'protect').returns(() => { })
        //stub firebase messaging
        sinon.stub(require('firebase-admin'),'messaging').get(() => () => ({
            send: sinon.fake.returns()
        }))
    })

    // Drop the whole users collection after finishing testing
    afterAll(async () => {
        sinon.restore()
        await mongoose.connection.collection('users').deleteMany({})
    })

    // Testing getting tokens
    it('Should update the web notifications token successfully', async () => {
        expect.assertions(4)
        const notificationService = new notificationsServices()
        const message = await notificationService.generateNotification("Hello", "Hi", "1234")
        const notif = await notificationService.sendNotification("", message)
        expect(notif.notification.title).toEqual('Hello')
        expect(notif.notification.body).toEqual('Hi')
        expect(notif.token[0]).toEqual('webToken')
        expect(notif.token[1]).toEqual('androidToken')
    })
})

// Testing Subscribing to topic
describe('notificationService sending request to subscribe to topic', () => {
    // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
        sinon.restore()
        await mongoose.connection.collection('users').deleteMany({})

        // Creating the valid user to assign the token to him
        const validUser = new User({
            name: 'omar',
            email: 'omar@email.com',
            password: 'password',
            webNotifToken: 'webToken',
            androidNotifToken: 'androidToken'
        })
        await validUser.save()
        //stub functions that need authorization
        sinon.stub(userServices.prototype, 'getUserId').returns(validUser._id)
        sinon.stub(require('../../controllers/authController'), 'protect').returns(() => { })
        //stub firebase messaging
        sinon.stub(require('firebase-admin'),'messaging').get(() => () => ({
            subscribeToTopic: sinon.fake.returns()
        }))
    })

    // Drop the whole users collection after finishing testing
    afterAll(async () => {
        sinon.restore()
        await mongoose.connection.collection('users').deleteMany({})
    })

    // Testing subscribing to topic
    it('Should request to subscribe to topic with valid tokens', async () => {
        expect.assertions(3)
        const notificationService = new notificationsServices()
        const sub = await notificationService.subscribeToTopic("", 'Amr Diab')
        expect(sub.topic).toEqual('Amr Diab')
        expect(sub.token[0]).toEqual('webToken')
        expect(sub.token[1]).toEqual('androidToken')
    })
})

