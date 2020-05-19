/** MongoDB Model for the Notification object.
 * @module models/notification
 * @requires mongoose
 */
const mongoose = require('mongoose')

/**
 * Notification schema
 * @alias module:models/notification
 * @type {object}
 * @property {String} userId The id of the user that this notification belongs to
 * @property {Object} notification The title and body of notification to be sent
 * @property {Object} data The data sent to the app (like uri of the notification object (artist, playlist, user, etc))
 * @property {Date} time The date of the notification
 * @const
 */
const notificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'Notification must belong to a certain user']
    },
    notification: {
        title: String,
        body: String
    },
    data: Object,
    time: Date 
})

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification
