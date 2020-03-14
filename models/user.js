const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Please provide an id']
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide a valid email'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date // Date of expiration of reset password token

})

const user = mongoose.model('user', userSchema)

module.exports = user
