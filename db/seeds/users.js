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
        name: "ahmed",
        email: "ahmed@email.com",
        password: "password1",
        gender: 'male',
        dateOfBirth: '2000-1-10'
    })
    
    const user2 = new User({
        name: "mohamed",
        email: "mohamed@email.com",
        password: "password2",
        gender: 'male',
        dateOfBirth: '2002-2-15'
    })
    
    const user3 = new User({
        name: "omar",
        email: "omar@email.com",
        password: "password3",
        gender: 'male',
        dateOfBirth: '2004-1-8'
    })
    
    const user4 = new User({
        name: "hana",
        email: "hana@email.com",
        password: "password4",
        gender: 'female',
        dateOfBirth: '1999-6-4',
        resetPasswordToken: "abcdefghijklmnopqrstuvwxyz",
        resetPasswordExpires: Date.now() + 3600000 // 1 Hour = 60 min * 60 sec = 3600000 ms
    })

    const user5 = new User({
        name: "nada",
        email: "nada@email.com",
        password: "password5",
        gender: 'female',
        dateOfBirth: '2006-5-7'
    })

    await user1.save()
    await user2.save()
    await user3.save()
    await user4.save()
    await user5.save()
}
