/** Express service for user
 * @module services/user
 * @requires express
 */

/**
 * User model from the database
 * @const
 */
const User = require('../models/userModel')

 /**
 * promisify module
 * util to import promisify function
 * @const
 */
const { promisify } = require('util');
/**
 * jwt module
 * jwt for tokens
 * @const
 */
const jwt = require('jsonwebtoken');

/**
 * crypto module
 * Crypto to generate random secure tokens
 * @const
 */
const crypto = require('crypto')


/**
 * Error object to send
 * @const
 */
const appError = require('../utils/appError')

/**
 * Class representing the user services needed for the user
 */
class userService {
  // Constructor with dependency injection
  /**
    * Constructs the player service
    * @param {*} userModel
    * @param {*} crypto
    */
  constructor(userModel, crypto) {
    this.userModel = userModel
    this.crypto = crypto
  }

  /**
  * Returns the id of the token provided for the user
  * @function
  * @param {string} authToken  - The authorization token of the user.
  * @return {string} The user id.
  */
  async getUserId (authToken) { 
    let token
    //get token and check if it exists
    if(authToken && authToken.startsWith('Bearer')) {
       token = authToken.split(' ')[1];
    }
    if(!token) {
      throw(new appError('You are not logged in! Please log in to access.', 401));
    }
    //verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const userId = decoded.id
    return userId
  }
  
  /**
  * Returns the role of the token provided for the user
  * @function
  * @param {authToken}  - The authorization token of the user.
  * @return {string} - The user role.
  */
  
  async getUserRole( authToken) {
    let token
    //get token and check if it exists
    if(authToken && authToken.startsWith('Bearer')) {
      token = authToken.split(' ')[1];
    }
    
    if(!token) {
      throw(new appError('You are not logged in! Please log in to access.', 401));
    }
    
    //verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const userId = decoded.id
    const userRole = await User.findById(userId).select('-_id role')
    
    return userRole.role
    
  }

   
  /**
  * Returns the email of the token provided for the user
  * @function
  * @param {authToken}  - The authorization token of the user.
  * @returns {string} - The user mail.
  */
  
 async getUserMail( authToken) {
   let token
  //get token and check if it exists
  if(authToken && authToken.startsWith('Bearer')) {
    token = authToken.split(' ')[1];
  }
  
  if(!token) {
    throw(new appError('You are not logged in! Please log in to access.', 401));
  }
  
  //verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const userId = decoded.id
  const userMail = await User.findById(userId).select('-_id email')
  
  return userMail.email
  
}

  /**
     * Creates a random secure token
     * @function
     * @param {number} size  - The size of the token string wanted
     * @return {string} - The token generated
     */
  async createTokenString(size) {
    const buff = crypto.randomBytes(size/2) //Divide by 2 as 1 byte = 2 hex digits
    const token = buff.toString('hex')
    return token;
  }

  /**
   * Assigns reset password token to a certain user
   * @function
   * @param {string} token - The token to be assigned to the user
   * @param {string} email - The user email
   */
  async assignResetToken(token, email) {
    // Search for the user with the provided email in the db.
    const user = await User.findOne({ email: email })
    if (!user) { // If user doesn't exist
      throw new appError('No user with this email exists : ' + email, 404)
    } else {
      // Update the user resetPassword token and save changes
      user.resetPasswordToken = token
      user.resetPasswordExpires = Date.now() + parseInt(process.env.RESET_PASSWORD_TOKEN_TIME, 10) * 1000 // 10 minutes (*1000 to be in ms)
      await user.save()
    }
  }


  /**
 * Changes the password after resetting in the db.
 * @function
 * @param {string} token  - The reset token
 * @param {string} newPassword - The user new password
 * @param {string} passwordConfirmation - The confirmation for the user password
 * @param {string} email - The current user email to be used by controller
 */
  async resetChangePassword(token, newPassword, passwordConfirmation) {
    // Searching for the user with this reset token if not expired.
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
    if(!user) {
      throw new appError('Invalid token !', 404)
    }
    if (newPassword === passwordConfirmation) {
      user.password = newPassword
      // Reset token no longer exists
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      // Save the user account after changing the password.
      await user.save()
      const email = user.email
      return email
    } else {
      throw new appError('Passwords don\'t match.', 403)
    }
  }

  /**
 * Assigns verification code to upgrade to the user
 * @function
 * @param {string} authToken  - The authorization token for the user
 * @param {strng} upgradeRole - The upgrade role 
 */
async assignUpgradeConfirmCode (authToken,token, upgradeRole) {
  // Get the user ID using authorization controller
  const userId = await this.getUserId(authToken)
    const user = await User.findById(userId)
      if (!user) { // If user doesn't exist
        throw (new appError('Couldn\'t find the user', 404))
      }else if(user.role == upgradeRole)
      {
        throw (new appError('User is already ' + upgradeRole +' !' , 403))
      } else {
      // Update the user premium verification code and save changes
        user.upgradeToken = token
        user.upgradeTokenExpires = Date.now() + parseInt(process.env.PREM_CONF_CODE_TIME, 10) * 1000 // 10 minutes (*1000 to be in ms)
        user.upgradeRole = upgradeRole
        await user.save()
      }  
}


/**
 * Checks if the confirmation code is valid and thus make the user a premium/artist one.
 * @function upgradeUserRole
 * @param {string} authToken - The authorization token for the user.
 * @param {string} confirmationCode - The confirmation code for the upgrade.
 */
async upgradeUserRole (authToken,confirmationCode ) {
  // Get the user ID using authorization controller
  const userId = await this.getUserId(authToken)
    const user = await User.findOne({ _id: userId, upgradeToken: confirmationCode, upgradeTokenExpires: { $gt: Date.now() } })
      if (!user) { // If no user with this token is found (token is invalid)
        throw (new appError('The code provided is not valid.', 404))
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
 * Checks if the cancellation code is valid and thus make the user a normal one.
 * @function
 * @param {string} authToken - The authorization token for the user.
 * @param {string} confirmationCode - The confirmation code for cancelling.
 */
async changeRoleToUser(authToken, confirmationCode) {
  // Get the user ID using authorization controller
  const userId = await this.getUserId(authToken)
    const user = await User.findOne({ _id: userId, upgradeToken: confirmationCode, upgradeTokenExpires: { $gt: Date.now() } })
      if (!user) { // If no user with this token is found (token is invalid)
        throw (new appError('The code provided is not valid.', 404))
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
