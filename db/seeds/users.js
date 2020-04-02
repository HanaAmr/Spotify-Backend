/** Seeder to have initial data for users
 * @module seeders/users
 * @requires express
 */


/**
 * Users seeder to call to fill initial database.
 * @type {object}
 * @const
 * @namespace usersSeeder
 */

const express = require('express')
/**
 * express module
 * User model from the database
 * @const
 */
const User = require('../../models/userModel')
const app = require('./../../app')
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
const mongoose= require('mongoose')
// Configuring environment variables to use them
dotenv.config({ path: '../../.env' })
const mongoDB = process.env.DATABASE_LOCAL
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.once('open', url => {
    console.log('Database connected')
    createUsers()
  })
  
  db.on('error', err => {
    console.error('connection error:', err)
  })

/**
 * A function that is used to create inital seed of users
 *
 * @memberof module:seeders/users~usersSeeder
 *
 */
createUsers = async() => {
    
    const user1 = new User({
        id: "id1",
        name: "user1",
        email: "user1@email.com",
        password: "password",
    })
    
    const user2 = new User({
        id: "id2",
        name: "user2",
        email: "user2@email.com",
        password: "password",
    })
    
    const user3 = new User({
        id: "id3",
        name: "omar",
        email: "omar@email.com",
        password: "password",
    })
    
    const user4 = new User({
        id: "id4",
        name: "user3",
        email: "user4@email.com",
        password: "password",
        resetPasswordToken: "abcdefghijklmnopqrstuvwxyz",
        resetPasswordExpires: Date.now() + 3600000 // 1 Hour = 60 min * 60 sec = 3600000 ms
    })

    await user1.save()
    await user2.save()
    await user3.save()
    await user4.save()
}
