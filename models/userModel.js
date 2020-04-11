/** MongoDB Model for the user object.
 * @module models/user
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

const dotenv = require('dotenv')
dotenv.config({ path: '.env' })


/**
 * User schema
 *  @alias module:models/user
 * @type {object}
 * @property {String} name name of the user
 * @property {String} href href of the user
 * @property {String} images images of the user
 * @property {String} externalUrls externalUrls of the user
 * @property {String} email email of the user
 * @property {String} password password of the user
 * @property {String} dateOfBirth dateOfBirth of the user
 * @property {String} facebookId facebookId of the user
 * @property {String} gender gender of the user
 * @property {String} role role of the user
 * @property {String} followers followers of the user
 * @property {String} following following of the user
 * @property {String} userStats userStats of the user
 * @property {String} createdPlaylists createdPlaylists of the user
 * @property {String} likedPlaylists likedPlaylists of the user
 * @property {String} artistInfo artistInfo of the user
 * @property {String} resetPasswordToken resetPasswordToken of the user
 * @property {String} resetPasswordExpires resetPasswordExpires of the user
 * @property {String} upgradeToken upgradeToken of the user
 * @property {String} upgradeTokenExpires upgradeTokenExpires of the user
 * @property {String} upgradeRole upgradeRole of the user
 * @property {String} uri uri of the user
 * @const
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
    default: '1980-01-01',
    validate: {
      validator: function () {
        return (this.dateOfBirth < '2000-01-01' && this.dateOfBirth > '1920-01-01')
      }
    }
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
    type: [String],
    default: 'http://138.91.114.14/api/public/imgs/users/default.jpg'
  },
  followers: {
    type: [String]
  },
  following: {
    type: [String]
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
      albums: [String] // Contains Albums IDs
      // popularSong: [String] // contains songs IDs

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
* @alias module:models/user
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
* @alias module:models/user
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
