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
    let userId
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
        userId = validUser._id
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
    it('Should get the web notifications token successfully', async () => {
        expect.assertions(2)
        const notificationService = new notificationsServices()
        const tokens = await notificationService.getToken(userId)
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
        const notif = await Notification.findOne({ "userId": "1234" })  //Notification added in db
        expect(notif.notification.title).toEqual('Hello')
        expect(notif.notification.body).toEqual('Hi')
        expect(message.notification.title).toEqual('Hello')
        expect(message.notification.body).toEqual('Hi')
    })

})

// Testing Sending notificaton
describe('notificationService sending notification functionality', () => {
    let userId
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
        userId = validUser._id
        //stub functions that need authorization
        sinon.stub(userServices.prototype, 'getUserId').returns(validUser._id)
        sinon.stub(require('../../controllers/authController'), 'protect').returns(() => { })
        //stub firebase messaging
        sinon.stub(require('firebase-admin'), 'messaging').get(() => () => ({
            send: sinon.fake.returns(),
            sendMulticast: sinon.fake.returns(),
            subscribeToTopic: sinon.fake.returns
        }))
    })

    // Drop the whole users collection after finishing testing
    afterAll(async () => {
        sinon.restore()
        await mongoose.connection.collection('users').deleteMany({})
    })

    // Testing sending notification
    it('Should send notification successfully', async () => {
        expect.assertions(4)
        const notificationService = new notificationsServices()
        const message = await notificationService.generateNotification("Hello", "Hi", "1234")
        const notif = await notificationService.sendNotification(userId, message)
        expect(notif.notification.title).toEqual('Hello')
        expect(notif.notification.body).toEqual('Hi')
        expect(notif.tokens[0]).toEqual('webToken')
        expect(notif.tokens[1]).toEqual('androidToken')
    })

    // Testing sending notifications
    it(`Shouldn't send notification successfully as no token is available `, async () => {
        //remove tokens for user
        const user = await User.findOne({"email":"omar@email.com"})
        user.webNotifToken = ''
        user.androidNotifToken = ''
        await user.save()
        expect.assertions(1)
        const notificationService = new notificationsServices()
        const message = await notificationService.generateNotification("Hello", "Hi", "1234")
        const notif = await notificationService.sendNotification(userId, message)
        expect(notif).toEqual(null)
    })

    // Testing sending notifications to topic
    it('Should send notification successfully to topic', async () => {
        const notificationService = new notificationsServices()
        const message = await notificationService.generateNotification("Hello", "Hi", "1234")
        message.topic = "Amr Diab"
        const notif = await notificationService.sendNotificationTopic(message)
    })
})

// Testing Subscribing to topic
describe('notificationService sending request to subscribe to topic', () => {
    let userId
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
        userId = validUser._id
        //stub functions that need authorization
        sinon.stub(userServices.prototype, 'getUserId').returns(validUser._id)
        sinon.stub(require('../../controllers/authController'), 'protect').returns(() => { })
        //stub firebase messaging
        sinon.stub(require('firebase-admin'), 'messaging').get(() => () => ({
            send: sinon.fake.returns(),
            sendMulticast: sinon.fake.returns(),
            subscribeToTopic: sinon.fake.returns
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
        const sub = await notificationService.subscribeToTopic(userId, 'Amr Diab',1)
        expect(sub.topic).toEqual('Amr Diab')
        expect(sub.tokens[0]).toEqual('webToken')
        expect(sub.tokens[1]).toEqual('androidToken')
    })
})


//Integration testing

// Testing updating notification token
describe('User can update his notification token', () => {
    let validUserId
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
        validUserId = validUser._id
        sinon.stub(userServices.prototype, 'getUserId').returns(validUser._id)
        sinon.stub(require('../../controllers/authController'), 'protect').returns(() => { })
    })

    // Drop the whole users collection after finishing testing
    afterAll(async () => {
        sinon.restore()
        await mongoose.connection.collection('users').deleteMany({})
    })

    // Testing updating webToken for notifications
    it('Should update the notification token for web app', async (done) => {
        const request = httpMocks.createRequest({
            method: 'PUT',
            url: '/me/notifications/token',
            body: {
                "type": "web",
                "token": "atoken"
            }
        })

        const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
        userController.updateNotificationsToken(request, response)
        response.on('end', async () => {
            try {
                expect(response.statusCode).toEqual(204)
                const usr = await User.findOne({ "email": "omar@email.com" })
                expect(usr.webNotifToken).toEqual('atoken')
                done()
            } catch (error) {
                done(error)
            }
        })
    })
})

// Testing getting notifications 
describe('User can get his notifications history', () => {
    let validUserId
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
        validUserId = validUser._id
        sinon.stub(userServices.prototype, 'getUserId').returns(validUser._id)
        sinon.stub(require('../../controllers/authController'), 'protect').returns(() => { })
    })

    // Drop the whole users collection after finishing testing
    afterAll(async () => {
        sinon.restore()
        await mongoose.connection.collection('users').deleteMany({})
    })

    // Testing getting user notifications
    it('Should get the notifications for the user', async (done) => {
        const notificationService = new notificationsServices()

        const request = httpMocks.createRequest({
            method: 'GET',
            url: '/me/notifications'
        })

        //add notification to user to test with
        await notificationService.generateNotification("Hello", "Hi2", validUserId)

        const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })
        userController.getNotifications(request, response)
        response.on('end', async () => {
            try {
                expect(response.statusCode).toEqual(200)
                const respArr = await response._getJSONData()
                const resp = await respArr.data
                expect(resp.results.items[0].notification.body).toEqual('Hi2')
                done()
            } catch (error) {
                done(error)
            }
        })
    })
})