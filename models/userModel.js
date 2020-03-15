const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    id: {
      type: String,
      required: [true, 'Please provide your id'],
      unique: true   
    },           
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
      type: String,
      required: [true, 'Please provide a uri']
    },      
    href: {
      type: String,
      required: [true, 'Please provide a href']
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
    }]    
});

userSchema.pre('save', async function(next) {  
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
 
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const user = mongoose.model('user', userSchema);

module.exports = user;