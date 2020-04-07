/** MongoDB Model for the user object.
 * @module models
 * @requires mongoose
 */

const mongoose = require('mongoose')

/**
 * validator to validate properties
 * @const
 */
const validator = require('validator')

/**
 * bcrypt to encrypt password
 * @const
 */
const bcrypt = require('bcryptjs')

/**
 * User object schema
 * @class user
 * @classdesc All the data of the user
 */
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 20,
    select: false
  },
  gender: {
    type: String,
    default: 'male'
  },
  dateOfBirth: {
    type: String,
    format: Date,
    default: '1980-01-01'
  },
  uri: {
    type: String,
    default: ''
  },
  href: {
    type: String,
    default: ''
  },
  externalUrls: {
    type: [String],
    default: ''
  },
  images: {
    type: String,
    default: ''
  },
  followers: {
    type: [String]
  },
  following: {
    type: [String]
  },
  product: {
    type: String,
    default: ''
  },
  userStats: [{
    // type: Schema.Types.ObjectId, ref: 'userStats'
  }],
  role: {
    type: String,
    enum: ['user', 'artist', 'premium'],
    default: 'user'
  },
  createdPlaylists: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Playlist'
  }],
  likedPlaylists: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Playlist'
  }],
  artistInfo: {
    type: {
      biography: String,
      popularity: Number,
      genres: [String], // Array of genres
      albums: [String], // Contains Albums IDs
      //popularSong: [String] // contains songs IDs

    }
  },
  facebookId: {
    type: String,
    default: ''
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date, // Date of expiration of reset password token
  upgradeToken: String,
  upgradeTokenExpires: Date, // Date of expiration of Upgrade token
  upgradeRole: { // Role to upgrade to
    type: String,
    enum: ['premium', 'artist']
  }

})

/**
* Encrypting password before saving
* @alias module:models/userModel
* @inner
* @param {string} save - encrypt password before saving in database.
* @param {callback} middleware - function encrypts password.
*/
userSchema.pre('save', async function (next) {
  // if the password changed hash it before saving in the database
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)

  next()
})

/**
* Encrypting password before saving
* @alias module:models/userModel
* @inner
* @param {string} candidate password - the input password.
* @param {string} user password - the user's password saved in database.
*/
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  // check if the given password matches the existing one
  return await bcrypt.compare(candidatePassword, userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User
