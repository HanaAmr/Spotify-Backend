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
createUsers = async () => {
  const user1 = new User({
    name: 'Imagine Dragons',
    email: 'dragonss@email.com',
    password: 'password1',
    gender: 'male',
    dateOfBirth: '2000-1-10',
    role: 'artist'
  })
  await user1.save()
  await user1.updateOne({href:`${process.env.API_URL}/users/${user1._id}`})
  await user1.updateOne({uri:`spotify:users:${user1._id}`})

  const user2 = new User({
    name: 'Ed Sheeran',
    email: 'sheeran@email.com',
    password: 'password2',
    gender: 'male',
    dateOfBirth: '2002-2-15',
    role: 'artist'
  })
  await user2.save()
  await user2.updateOne({href:`${process.env.API_URL}/users/${user2._id}`})
  await user2.updateOne({uri:`spotify:users:${user2._id}`})

  const user3 = new User({
    name: 'Amr Diab',
    email: 'amr@email.com',
    password: 'password3',
    gender: 'male',
    dateOfBirth: '2004-1-8',
    role: 'artist'
  })
  await user3.save()
  await user3.updateOne({href:`${process.env.API_URL}/users/${user3._id}`})
  await user3.updateOne({uri:`spotify:users:${user3._id}`})

  const user4 = new User({
    name: '21 Pilots',
    email: 'pilots@email.com',
    password: 'password4',
    gender: 'female',
    dateOfBirth: '1999-6-4',
    role: 'artist'
  })
  await user4.save()
  await user4.updateOne({href:`${process.env.API_URL}/users/${user4._id}`})
  await user4.updateOne({uri:`spotify:users:${user4._id}`})

  const user5 = new User({
    name: 'Ahmed',
    email: 'ahmed@email.com',
    password: 'password5',
    gender: 'male',
    dateOfBirth: '2006-5-7'
  })
  await user5.save()
  await user5.updateOne({href:`${process.env.API_URL}/users/${user5._id}`})
  await user5.updateOne({uri:`spotify:users:${user5._id}`})

  const user6 = new User({
    name: 'Omar',
    email: 'omar@email.com',
    password: 'password6',
    gender: 'male',
    dateOfBirth: '2006-5-7'
  })
  await user6.save()
  await user6.updateOne({href:`${process.env.API_URL}/users/${user6._id}`})
  await user6.updateOne({uri:`spotify:users:${user6._id}`})

  const user7 = new User({
    name: 'Hana',
    email: 'hana@email.com',
    password: 'password7',
    gender: 'female',
    dateOfBirth: '1999-3-3',
    role: 'premium'
  })
  await user7.save()
  await user7.updateOne({href:`${process.env.API_URL}/users/${user7._id}`})
  await user7.updateOne({uri:`spotify:users:${user7._id}`})

  const user8 = new User({
    name: 'Nada',
    email: 'nada@email.com',
    password: 'password8',
    gender: 'female',
    dateOfBirth: '1999-7-10',
    role: 'premium'
  })
  await user8.save()
  await user8.updateOne({href:`${process.env.API_URL}/users/${user8._id}`})
  await user8.updateOne({uri:`spotify:users:${user8._id}`})

  await user1.updateOne({ following: user2._id })
  await user2.updateOne({ followers: user1._id })

  await user3.updateOne({ following: user4._id })
  await user4.updateOne({ followers: user3._id })

  await user5.updateOne({ following: user6._id })
  await user6.updateOne({ followers: user5._id })

  await user7.updateOne({ following: user8._id })
  await user8.updateOne({ followers: user7._id })

  process.exit()
}
