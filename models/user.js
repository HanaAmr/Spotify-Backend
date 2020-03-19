/** Express controller providing user model
 * @module controllers/users
 * @requires express
 */

 /**
 * express module
 * @const
 */
const mongoose = require('mongoose');

/**
 * express module
 * validator to validate properties
 * @const
 */
const validator = require('validator');

/**
 * express module
 * bcrypt to encrypt password
 * @const
 */
const bcrypt = require('bcryptjs');

/**
 * express module
 * @const
 */
const Schema = mongoose.Schema;

/**
 * EUser schema
 * @type {object}
 * @const
 */
const userSchema = new Schema({          
    name: { 
      type: String,
      required: [true, 'Please provide your name'],
      trim: true
    },      
    email: {
      type: String,
      required:[true, 'Please provide your email'],
      trim: true, 
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },      
    password: {           //confirm password
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      maxlength: 20,
      select: false    
    },     
    gender: {
      type: String
    },      
    dateOfBirth: {
      type: String,
      format: Date
    },       
    uri: {
      type: String
      //required: [true, 'Please provide a uri']
    },      
    href: {
      type: String
      //required: [true, 'Please provide a href']
    },      
    externalUrls: [{
      //type: Schema.Types.ObjectId, ref: 'externalUrl'
    }],    
    images: {
      type: Array,
      //items: [{type: Schema.Types.ObjectId, ref: 'image'}]
    },          
    country: {
      type: String
    },      
    type: {
      type: String
    },      
    followers: {
      type: Array,
      //items: [{type: Schema.Types.ObjectId, ref: 'followers'}]
    },        
    product: {
      type: String
    },       
    userStats: [{
      //type: Schema.Types.ObjectId, ref: 'userStats'
    }],
    role: {
      type: String,
      enum: ['user', 'artist', 'premium'],
      default: 'user'
    },    
    resetPasswordToken: String,
    resetPasswordExpires: Date, // Date of expiration of reset password token
    becomePremiumToken: String,
    becomePremiumExpires: Date, // Date of expiration of become premium token
    becomeArtistToken: String,
    becomeArtistExpires: Date, // Date of expiration of become artist verification code
    
});

/**
* Encrypting password before saving
* @function
* @memberof module:models/userModel
* @inner
* @param {string} save - encrypt password before saving in database.
* @param {callback} middleware - function encrypts password.
*/
userSchema.pre('save', async function(next) {  
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
 
    next();
});

/**
* Encrypting password before saving
* @function
* @memberof module:models/userModel
* @inner
* @param {string} candidate password - the input password.
* @param {string} user password - the user's password saved in database.
*/
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const user = mongoose.model('user', userSchema);

module.exports = user;