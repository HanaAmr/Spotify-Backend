/** Express service for user
 * @module services/user
 * @requires express
 */

/**
 * express module
 * User model from the database
 * @const
 */
const User = require('../models/userModel')
 /**
 * express module
 * util to import promisify function
 * @const
 */
const { promisify } = require('util');
/**
 * express module
 * jwt for tokens
 * @const
 */
const jwt = require('jsonwebtoken');

 /**
 * express module
 * Async functions
 * @const
 */
const async = require('async')

/**
 * express module
 * Crypto to generate random secure tokens
 * @const
 */
const crypto = require('crypto')

/**
 * express module
 * catchAsync object
 * @const
 */
const catchAsync = require('../utils/catchAsync')

/**
 * express module
 * error object
 * @const
 */
const AppError = require('../utils/appError')

class userService {
  // Constructor with dependency injection
  constructor(userModel, crypto) {
    this.userModel = userModel
    this.crypto = crypto
  }

  /**
  * A function that returns the id of the token provided for the user
  * @function
  * @memberof module:controllers/authController
  * @param {authToken}  - The token
  */
  
  async getUserId (authToken) { 
    let token
    //get token and check if it exists
    if(authToken && authToken.startsWith('Bearer')) {
       token = authToken.split(' ')[1];
    }
    if(!token) {
      throw(new AppError('You are not logged in! Please log in to access.', 401));
    }
    //verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const userId = decoded.id
    return userId
  }
  
  /**
  * A function that returns the role of the token provided for the user
  * @function
  * @memberof module:controllers/authController
  * @param {authToken}  - The token
  */
  
  async getUserRole( authToken) {
    let token
    //get token and check if it exists
    if(authToken && authToken.startsWith('Bearer')) {
      token = authToken.split(' ')[1];
    }
    
    if(!token) {
      throw(new AppError('You are not logged in! Please log in to access.', 401));
    }
    
    //verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const userId = decoded.id
    const userRole = await User.findById(userId).select('-_id role')
    
    return userRole.role
    
  }

   
  /**
  * A function that returns the email of the token provided for the user
  * @function
  * @memberof module:controllers/authController
  * @param {authToken}  - The token
  */
  
 async getUserMail( authToken) {
   let token
  //get token and check if it exists
  if(authToken && authToken.startsWith('Bearer')) {
    token = authToken.split(' ')[1];
  }
  
  if(!token) {
    throw(new AppError('You are not logged in! Please log in to access.', 401));
  }
  
  //verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const userId = decoded.id
  const userMail = await User.findById(userId).select('-_id email')
  
  return userMail.email
  
}

  /**
     * A function that is used to create a random secure token
     * @memberof module:controllers/users~userController
     * @param {Size}  - The size of the token string wanted
     * @param {token} - The token generated
     */
  async createTokenString(size) {
    const buff = crypto.randomBytes(size)
    const token = buff.toString('hex')
    return token;
  }

  /**
   * A function that is used to assign reset password token to a certain user
   * @memberof module:controllers/users~userController
   * @param {Token}  - The token to be assigned to the user
   * @param {Email} - The user email
   */
  async assignResetToken(token, email) {
    // Search for the user with the provided email in the db.
    const user = await User.findOne({ email: email })
    if (!user) { // If user doesn't exist
      throw new AppError('No user with this email exists : ' + email, 404)
    } else {
      // Update the user resetPassword token and save changes
      user.resetPasswordToken = token
      user.resetPasswordExpires = Date.now() + parseInt(process.env.RESET_PASSWORD_TOKEN_TIME, 10) * 1000 // 10 minutes (*1000 to be in ms)
      await user.save()
    }
  }


  /**
 * A function that is used to change the password after resetting in the db.
 * @memberof module:controllers/users~userController
 * @param {Reset Token}  - The reset token
 */
  async resetChangePassword(token, newPassword, passwordConfirmation) {
    // Searching for the user with this reset token if not expired.
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
    if(!user) {
      throw new AppError('Invalid token !', 404)
    }
    if (newPassword === passwordConfirmation) {
      user.password = newPassword
      // Reset token no longer exists
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      // Save the user account after changing the password.
      await user.save()
    } else {
      throw new AppError('Passwords don\'t match.', 403)
    }
  }

  /**
 * A function that is used to assign verification code to upgrade to the user
 * @memberof module:controllers/users~userController
 * @param {Token}  - The token for upgrade
 * @param {upgradeRole} - The upgrade role 
 */
async assignUpgradeConfirmCode (authToken,token, upgradeRole) {
  // Get the user ID using authorization controller
  const userId = await this.getUserId(authToken)
    const user = await User.findById(userId)
      if (!user) { // If user doesn't exist
        throw (new AppError('Couldn\'t find the user', 404))
      } else {
      // Update the user premium verification code and save changes
        user.upgradeToken = token
        user.upgradeTokenExpires = Date.now() + parseInt(process.env.PREM_CONF_CODE_TIME, 10) * 1000 // 10 minutes (*1000 to be in ms)
        user.upgradeRole = upgradeRole
        await user.save()
      }  
}


/**
 * A function that is used to check if the confirmation code is valid and thus make the user a premium/artist one.
 * @memberof module:controllers/users~userController
 * @param {Token}  - The token for upgrade
 * @param {confirmationCode} - The confirmation code
 */
async upgradeUserRole (authToken,confirmationCode ) {
  // Get the user ID using authorization controller
  const userId = await this.getUserId(authToken)
    const user = await User.findOne({ _id: userId, upgradeToken: confirmationCode, upgradeTokenExpires: { $gt: Date.now() } })
      if (!user) { // If no user with this token is found (token is invalid)
        throw (new AppError('The code provided is not valid.', 404))
      } else {
        user.role = user.upgradeRole
        // Reset token no longer exists
        user.upgradeToken = undefined
        user.upgradeTokenExpires = undefined
        // Save the user account after changing the role to premium.
        await user.save()
      }
    }

    /**
 * A function that is used to check if the cancellation code is valid and thus make the user a normal one.
 * @memberof module:controllers/users~userController
 * @param {Token}  - The token for upgrade
 * @param {confirmationCode} - The confirmation code
 */
async changeRoleToUser(authToken, confirmationCode) {
  // Get the user ID using authorization controller
  const userId = await this.getUserId(authToken)
    const user = await User.findOne({ _id: userId, upgradeToken: confirmationCode, upgradeTokenExpires: { $gt: Date.now() } })
      if (!user) { // If no user with this token is found (token is invalid)
        throw (new AppError('The code provided is not valid.', 404))
      } else {
        user.role = 'user'
        // Reset token no longer exists
        user.upgradeToken = undefined
        user.upgradeTokenExpires = undefined
        // Save the user account after changing the role to premium.
        await user.save()
      }
}
}

module.exports = userService
