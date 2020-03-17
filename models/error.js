/** Express router providing error model
 * @module models/errors
 * @requires express
 */

 /**
 * express module
 * @const
 */
const mongoose = require('mongoose')
/**
 * express module
 * @const
 */
const Schema = mongoose.Schema
/**
 * Error schema
 * @type {object}
 * @const
 */
const errorSchema = mongoose.Schema({
  status: {
    type: Number,
    required: [true, 'Please provide a status for the error']
  },
  message: {
    type: String
  }
})

const error = mongoose.model('error', errorSchema)

module.exports = error
