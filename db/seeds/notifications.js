/** Seeder to have initial data for notifications
 * @module seeders/users
 * @requires express
 */

/**
 * Users seeder to call to fill initial database.
 * @type {object}
 * @const
 */

const express = require('express')
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
 * dotenv to access environment constants
 * @const
 */
const dotenv = require('dotenv')
/**
 * express module
 * Mongoose to access and change the database
 * @const
 */
const mongoose = require('mongoose')
// Configuring environment variables to use them
dotenv.config({ path: '../../.env' })
const mongoDB = process.env.DATABASE_LOCAL
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.once('open', url => {
  console.log('Database connected')
  createNotifications()
})

db.on('error', err => {
  console.error('connection error:', err)
})

/**
 * A function that is used to create inital seed of notifications
 *
 * @memberof module:seeders/notifications
 *
 */
createNotifications = async () => {
  // Users
  const users = await User.find({}).select('_id')
  const user1Id = users[0]._id
  const user2Id = users[1]._id
  const user3Id = users[2]._id
  const user4Id = users[3]._id

  // Notification data
  const title = 'You have been followed!'
  const body = 'Weigl has followed you!'
  const data = { uri: 'user.uri', id: 'user._id', href: 'user.href' }
  const notif1 = new Notification()
  const notif2 = new Notification()
  const notif3 = new Notification()
  const notif4 = new Notification()

  notif1.notification.title = title
  notif1.notification.body = body
  notif1.data = data
  notif1.time = Date.now()
  notif1.userId = user1Id
  await notif1.save()

  notif2.notification.title = title
  notif2.notification.body = body
  notif2.data = data
  notif2.time = Date.now()
  notif2.userId = user2Id
  await notif2.save()

  notif3.notification.title = title
  notif3.notification.body = body
  notif3.data = data
  notif3.time = Date.now()
  notif3.userId = user3Id
  await notif3.save()

  notif4.notification.title = title
  notif4.notification.body = body
  notif4.data = data
  notif4.time = Date.now()
  notif4.userId = user4Id
  await notif4.save()

  process.exit()
}
