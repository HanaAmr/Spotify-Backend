/**
 * Models module.
 * @module models/category
 * @requires mongoose
 */

const mongoose = require('mongoose')

/**
 * Category schema
 *  @alias module:models/category
 * @type {object}
 * @property {String} name Name of the category
 * @property {String} href href of the category
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
    // required: [true, ' A link to the Web API endpoint returning full details of the category.'],
    default: ''
  }
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
