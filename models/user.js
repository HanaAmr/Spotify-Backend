const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = mongoose.Schema({
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
    lowercase: true
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
    type: String,
    //required: [true, 'Please provide a uri']
  },      
  href: {
    type: String,
    //required: [true, 'Please provide a href']
  },      
  externalUrls: [{
    type: [String]
  }],    
  images: {
    type: [String]
  },          
  country: {
    type: String
  },      
  type: {
    type: String
  },      
  followers: {
    type: Array,
    default:0
    //items: [{type: Schema.Types.ObjectId, ref: 'followers'}]
  },        
  product: {
    type: String
  },       
  userStats: [{
    //type: Schema.Types.ObjectId, ref: 'userStats'
  }]  ,
  resetPasswordToken: String,
  resetPasswordExpires: Date,// Date of expiration of reset password token

  artistInfo: {
    type: {
      biography: String,
      popularity: Number,
      genres: [String] ,  //Array of genres
      albums: [String],   //Contains Albums IDs
      popularSong: [String],  //contains songs IDs
      
    }
  }
})

const user = mongoose.model('users', userSchema)

module.exports = user
