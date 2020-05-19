// /** Express service for music player
//  * @module services/notifications
//  * @requires express
//  */


/**
 * Firebase needed for notifications apis
 * @const
 */
const admin = require('firebase-admin')
admin.initializeApp({
  credential: admin.credential.applicationDefault()
})

/**
 * User model from the database
 * @const
 */
const User = require('../models/userModel')

/**
 * Notification model from the database
 * @const
 */
const Notification = require('../models/notificationModel')


/**
 *
 * App error util
 * @const
 */
const AppError = require('../utils/appError')

/**
 * User services class
 * @const
 */
const UserServices = require('./userService')

const userService = new UserServices()

/**
 * Class reprensenting the notifications services needed to send notifications
 */
class notificationService {
  // Constructor with dependency injection
  /**
    * Constructs the notifications service
    * @param {*} userService
    */
  constructor(userService) {
    this.userService = userService
  }

  /**
    * Update the notification token of the user
    * @function
    * @param {String} authToken - The authorization token of the user.
    * @param {String} type - The type of the device, web or android
    * @param {String} token - The new token to assign to the user
    */
  async updateToken(authToken, type, token) {
    const userId = await userService.getUserId(authToken)
    if (type == 'web') {
      await User.update({ _id: userId }, { $set: { webNotifToken: token } }) //Update Web token of user 
    } else if (type == 'android') {
      await User.update({ _id: userId }, { $set: { androidNotifToken: token } }) //Update Web token of user 
    } else {
      throw new AppError("Not a valid type for the token!", 403)
    }
  }

  /**
    * Gets user notification tokens
    * @function
    * @param {String} userId - The userId of the user.
    * @returns {Array} Array of 2 strings, first one is the web token for notifications, second is the android token for notifications
    */
  async getToken(userId) {
    const user = await User.findOne({ "_id": userId })
    const webToken = user.webNotifToken
    const androidToken = user.androidNotifToken
    const tokenArr = [webToken, androidToken]
    return tokenArr
  }

  /**
    * Generate notification to send to user and saves it to database.
    * @function
    * @param {String} title - The title of the notification.
    * @param {String} message - The message of the notification.
    * @returns {Object} - The notification JSON to send to user
    */
  async generateNotification(title, body, userId, data) {
    const notif = new Notification()
    notif.notification.title = title
    notif.notification.body = body
    notif.data = data
    notif.time = Date.now()
    notif.userId = userId
    await notif.save()
    const message = {"notification": notif.notification, "token":"", "data": notif.data}
    return message
  }

  
  /**
    * Sends notification to user
    * @function
    * @param {String} authToken - The authorization token of the user.
    * @param {String} notification - The notification to be sent
    * @returns {Object} notification - The notification sent
    */
  async sendNotification(userId, notification) {
    const tokens = await this.getToken(userId)
    //Check if no tokens available, then don't send notification.
    if(tokens[0]=='' && tokens[1]== '') return null
    let tokensToSend = []
    //Add existing tokens only
    if (tokens[0] != '') tokensToSend.push(tokens[0])
    if (tokens[1] != '') tokensToSend.push(tokens[1])
    notification.token = tokensToSend
    await admin.messaging().send(notification)
    return notification
  }

  /**
    * Sends notification to topic subscribers
    * @function
    * @param {String} authToken - The authorization token of the user.
    * @param {String} notification - The notification to be sent
    * @returns {Object} notification - The notification sent
    */
   async sendNotificationTopic(notification) {
    await admin.messaging().send(notification)
  }

  /**
    * Subscribe to topic for user
    * @function
    * @param {String} userId - The userId of the user.
    * @param {String} topic - The authorization token of the user.
    * @returns {Object} - The tokens used and the topic to subscribe to.
    */
   async subscribeToTopic(userId, topic) {
    const tokens = await this.getToken(userId)
    let tokensToSend = []
    if (tokens[0] != null) tokensToSend.push(tokens[0])
    if (tokens[1] != null) tokensToSend.push(tokens[1])
    await admin.messaging().subscribeToTopic(tokensToSend, topic)
    const subscription = {
      'token':tokensToSend,
      'topic': topic
    }
    return subscription
  }
}

module.exports = notificationService