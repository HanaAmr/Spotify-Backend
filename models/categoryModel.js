/** Express controller providing category model
 * @module controllers/category
 * @requires express
 */

/**
 * express module
 * @const
 */
const mongoose = require('mongoose')

/**
 * Category schema
 * @type {object}
 * @const
 */
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name of the category'],
    unique: true
  },
  href: {
    type: String,
    required: [true, ' A link to the Web API endpoint returning full details of the category.']
  },
  images: {
    type: String,
    required: [true, 'A category must have an image']
  }
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
