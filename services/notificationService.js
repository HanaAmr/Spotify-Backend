// /** Express service for music player
//  * @module services/notifications
//  * @requires express
//  */


/**
 * Firebase needed for notifications apis
 * @const
 */
var admin = require("firebase-admin")

var serviceAccount = require("./../service-account-file.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://totally-not-spotify.firebaseio.com"
});

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
    * @param {String} body - The body of message of the notification.
    * @param {String} userId - The user id of the user to receive notification.
    * @param {Object} data - The data of the notification. (URI, HREF, Images links, etc)
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
    const message = { "notification": notif.notification, "tokens": "", "data": notif.data }
    return message
  }


  /**
    * Sends notification to user
    * @function
    * @param {String} userId - The user id of the user.
    * @param {Object} notification - The notification to be sent
    * @returns {Object} notification - The notification sent
    */
  async sendNotification(userId, notification) {
    const tokens = await this.getToken(userId)
    //Check if no tokens available, then don't send notification.
    if (tokens[0] == '' && tokens[1] == '') return null
    let tokensToSend = []
    //Add existing tokens only
    if (tokens[0] != '') tokensToSend.push(tokens[0])
    if (tokens[1] != '') tokensToSend.push(tokens[1])
    notification.tokens = tokensToSend 
    await admin.messaging().sendMulticast(notification)
    return notification
  }

  /**
    * Sends notification to topic subscribers
    * @function
    * @param {Object} notification - The notification to be sent
    */
  async sendNotificationTopic(notification) {
    await admin.messaging().send(notification)
  }

  /**
    * Subscribe/Unsubscribe to topic for user
    * @function
    * @param {String} userId - The userId of the user.
    * @param {String} topic - The authorization token of the user.
    * @param {Bool} subscribe -The type of the request, if 1 then it is subscribe, if 0 then it is unsubscribe
    * @returns {Object} - The tokens used and the topic to subscribe to.
    */
  async subscribeToTopic(userId, topic, subscribe) {
    const tokens = await this.getToken(userId)
    //Check if no tokens available, then don't send notification.
    if (tokens[0] == '' && tokens[1] == '') return null
    let tokensToSend = []
    if (tokens[0] != null) tokensToSend.push(tokens[0])
    if (tokens[1] != null) tokensToSend.push(tokens[1])
    if(subscribe)
      await admin.messaging().subscribeToTopic(tokensToSend, topic)
    else 
      await admin.messaging().unsubscribeFromTopic(tokensToSend, topic)
    const subscription = {
      'tokens': tokensToSend,
      'topic': topic
    }
    return subscription
  }
}

module.exports = notificationService