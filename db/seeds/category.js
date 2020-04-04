/** Seeder to have initial data for users
 * @module seeders/category
 * @requires express
 */

/**
 * Users seeder to call to fill initial database.
 * @type {object}
 * @const
 * @namespace categorySeeder
 */

const express = require('express')
/**
 * express module
 * Category model from the database
 * @const
 */
const Category = require('../../models/categoryModel')
//const app = express()
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
const mongoose = require('mongoose')
// Configuring environment variables to use them
dotenv.config({ path: '../../.env' })
const mongoDB = process.env.DATABASE_LOCAL
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.once('open', url => {
  console.log('Database connected')
  createCategories()
})

db.on('error', err => {
  console.error('connection error:', err)
})

/**
 * A function that is used to create inital seed of users
 *
 * @memberof module:seeders/categories~categorySeeder
 *
 */
createCategories = async () => {
  const category1 = new Category({
    name: 'Jazz',
  })
  await category1.save()
  await category1.updateOne({href:`http://127.0.0.1:6000/api/v1/browse/categories/${category1._id}/playlists`})


  const category2 = new Category({
    name: 'Happy',
  })
  await category2.save()
  await category2.updateOne({href:`http://127.0.0.1:6000/api/v1/browse/categories/${category2._id}/playlists`})

  const category3 = new Category({
    name: 'Arabic',
  })
  await category3.save()
  await category3.updateOne({href:`http://127.0.0.1:6000/api/v1/browse/categories/${category3._id}/playlists`})

}


//Sequence : category -> user -> album -> track -> playlist