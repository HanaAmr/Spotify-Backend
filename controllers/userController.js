/** Express controller providing user related controls
 * @module controllers/users
 * @requires express
 */

/**
 * User controller to call when routing.
 * @type {object}
 * @const
 * @namespace userController
 */

/**
 * express module
 * User model from the database
 * @const
 */
const User = require('../models/userModel')
/**
 * express module
 * Async functions
 * @const
 */
const async = require('async')
/**
 * express module
 * Nodemailer to send emails
 * @const
 */
const nodemailer = require('nodemailer')
/**
 * express module
 * Crypto to generate random secure tokens
 * @const
 */
const crypto = require('crypto')

/**
 * express module
 * jwt for tokens
 * @const
 */
const jwt = require('jsonwebtoken');


/**
 * express module
 * error object
 * @const
 */
const AppError = require('../utils/appError')

/**
 * express module
 * Reset password middleware
 * @const
 */
const resetPasswordMiddleware = require('../middleware/user/resetPassword')


/**
 * express module
 * Premium user middleware
 * @const
 */
const premiumMiddleware = require('../middleware/user/premium')

/**
 * A function that is used to reset password for users by sending them emails to change the password.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const requestResetPassword = function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we are creating a random token then assign it to a user and send him an email with the link to reset the password.
  async.waterfall([async.apply(resetPasswordMiddleware.createTokenString, req, res, process.env.RESET_PASSWORD_TOKEN_SIZE), resetPasswordMiddleware.assignResetToken, resetPasswordMiddleware.sendResetPasswordMail], (err) => {
    // If we catch an internal server error, update the resond and create error object to send
    if (err) {
      return next(err)
    } else { // If everything is fine, send an empty body code 204.
      res.status(204)
      next()
    }
  })
}



/**
 * A function that is used to change password for users after requesting to reset it.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const resetPassword = function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we change the password if valid, then send an email informing the user.
  async.waterfall([async.apply(resetPasswordMiddleware.resetChangePassword, req, res), resetPasswordMiddleware.sendSuccPasswordResetMail], (err) => {
    // If we catch an internal server error
    if (err) {
      return next(err)
    } else {
      res.status(204)
      next()
    }
  })
}


/**
 * A function that is used to become a premium user.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const requestBecomePremium = function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we are creating a verification code then assign it to the user and send him an email with the verification code.
  async.waterfall([async.apply(premiumMiddleware.createTokenString, req, res, process.env.PREM_CONF_CODE_SIZE), premiumMiddleware.assignPremiumConfirmCode, premiumMiddleware.sendPremiumConfirmCodeMail], (err) => {
    // If we catch an internal server error, update the resond and create error object to send
    if (err) {
      return next(err)
    } else { // If everything is fine, send an empty body code 204.
      res.status(204)
      next()
    }
  })
}

/**
 * A function that is used to check for the confirmation code to make the user a premium one.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const confirmBecomePremium = function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we change the password if valid, then send an email informing the user.
  async.waterfall([async.apply(premiumMiddleware.changeRoleToPremium, req, res), premiumMiddleware.sendSuccPremiumMail], (err) => {
    // If we catch an internal server error
    if (err) {
      return next(err)
    } else {
      res.status(204)
      next()
    }
  })
}

/**
 * A function that is used to cancel premium subscription.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const requestCancelPremium = function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we are creating a verification code then assign it to the user and send him an email with the verification code.
  async.waterfall([async.apply(premiumMiddleware.createTokenString, req, res, process.env.PREM_CONF_CODE_SIZE), premiumMiddleware.assignPremiumCancelCode, premiumMiddleware.sendPremiumCancelCodeMail], (err) => {
    // If we catch an internal server error, update the resond and create error object to send
    if (err) {
      return next(err)
    } else { // If everything is fine, send an empty body code 204.
      res.status(204)
      next()
    }
  })
}

/**
 * A function that is used to check for the cancellation code to make the user a normal one.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const confirmCancelPremium = function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we change the password if valid, then send an email informing the user.
  async.waterfall([async.apply(premiumMiddleware.changeRoleToUser, req, res), premiumMiddleware.sendSuccPremiumCancelMail], (err) => {
    // If we catch an internal server error
    if (err) {
      return next(err)
    } else {
      res.status(204)
      next()
    }
  })
}




// Handling which module to export, to be able to export private functions when testing
const userController = {}

//Functions needed for production only
userController.prodExports = {
requestResetPassword : requestResetPassword,
resetPassword : resetPassword,
requestBecomePremium: requestBecomePremium,
confirmBecomePremium: confirmBecomePremium,
requestCancelPremium: requestCancelPremium,
confirmCancelPremium: confirmCancelPremium
}
// Exporting the functions needed for unit testing
userController.testExports = {
resetPassword : resetPassword,
requestResetPassword: requestResetPassword,
requestBecomePremium: requestBecomePremium,
confirmBecomePremium: confirmBecomePremium,
requestCancelPremium: requestCancelPremium,
confirmCancelPremium: confirmCancelPremium,
nodemailer: nodemailer
}

const exported = process.env.NODE_ENV==='test' ? userController.testExports : userController.prodExports
module.exports = exported