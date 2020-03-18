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
const User = require('../models/user')
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
 * error object
 * @const
 */
const AppError = require('../utils/appError')

/**
 * A function that is used to reset password for users by sending them emails to change the password.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const resetPasswordSendMail = function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we are creating a random token then assign it to a user and send him an email with the link to reset the password.
  async.waterfall([async.apply(createTokenString, req, res), assignUserResetToken, sendResetPasswordEmail], (err) => {
    // If we catch an internal server error, update the resond and create error object to send
    if (err) {
      return next(err)
    } else { // If everything is fine, send an empty body code 204.
      res.status(204).send()
      next(null)
    }
  })
}

/**
 * A function that is used to create a random secure token
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {done} - The next function in the middleware
 */
const createTokenString = function (req, res, done) {
  crypto.randomBytes(20, (err, buf) => {
    const token = buf.toString('hex')
    done(err, req, res, token)
  })
}

/**
 * A function that is used to assign reset password token to a certain user
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const assignUserResetToken = function (req, res, token, done) {
  // Search for the user with the provided email in the db.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return done(new AppError('An unexpected error has occured : ' + req.body.email, 500))
    } else if (!user) { // If user doesn't exist
      return done(new AppError('No user with this email exists : ' + req.body.email, 404))
    } else {
    // Update the user resetPassword token and save changes
      user.resetPasswordToken = token
      user.resetPasswordExpires = Date.now() + 3600000 // 1 Hour = 60 min * 60 sec = 3600000 ms
      user.save((err) => {
        done(err, req, res, token, user)
      })
    }
  })
}

/**
 * A function that is used to send the reset password email to the user.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const sendResetPasswordEmail = function (req, res, token, user, done) {
  // Creating transporting method for nodemailer
  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAILUSR,
      pass: process.env.GMAILPW
    }
  })
  // Creating the mail to send
  const mailOptions = {
    to: user.email,
    from: process.env.GMAILUSR,
    subject: 'Reset your Spotify password',
    text: 'Hello.\n\nNo need to worry, you can reset your Spotify password by clicking the link below: ' +
          'http://' + req.headers.host + '/resetPassword/' + token + '\n\n' +
          ' If you didn\'t request a password reset, feel free to delete this email and carry on enjoying your music!\n All the best,\nSystem 424 Team \n'
  }
  // Sending the email
  smtpTransport.sendMail(mailOptions, (err) => {
    if (err) {
      console.log('Couldn\'t send the reset password email')
      return done(new AppError('Couldn\'t send the email ', 502))
    } else console.log('Reset Email sent\n')
    done(null)
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
  async.waterfall([async.apply(changePasswordReset, req, res), sendSuccPassResetEmail], (err) => {
    // If we catch an internal server error
    if (err) {
      return next(err)
    } else {
      res.status(204).send()
      next(null)
    }
  })
}

/**
 * A function that is used to change the password after resetting in the db.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const changePasswordReset = function (req, res, done) {
  // Searching for the user with this reset token if not expired.
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (err) {
      console.log('Unexpected internal server error : ' + err)
      return done(new AppError('An internal server error has occurred.', 500))
    } else if (!user) { // If no user with this token is found (token is invalid)
      return done(new AppError('The token provided is not valid.', 404))
    } else if (req.body.newPassword === req.body.passwordConfirmation) {
      // TODO: call the function that sets the password when done
      user.password = req.body.newPassword
      // Reset token no longer exists
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined

      // Save the user account after changing the password.
      user.save((err) => {
        if (err) { // If error, means if database refused password as it is too short.
          return done(new AppError('Your password is too weak/short', 403))
        }
        done(err, req, res, user)
        // TODO: should be logged in with the login function
      })
    } else {
      return done(new AppError('Passwords don\'t match.', 403))
    }
  })
}

/**
 * A function that is used to send email confirming changing the password.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */

const sendSuccPassResetEmail = function (req, res, user, done) {
  // Creating the email transporting method
  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAILUSR,
      pass: process.env.GMAILPW
    }
  })
  // Creating the mail to send
  const mailOptions = {
    to: user.email,
    from: process.env.GMAILUSR,
    subject: 'Your password has been changed',
    text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
  }
  // Sending the email
  smtpTransport.sendMail(mailOptions, (err) => {
    if (err) {
      console.log('Couldn\'t send confirming email')
      return done(new AppError('Couldn\'t send the confirming email.', 502))
    } else console.log('Reset confirming Email sent\n')
    done(null)
  })
}

// Exporting the functions needed for unit testing
exports.resetPasswordSendMail = resetPasswordSendMail
exports.createTokenString = createTokenString
exports.assignUserResetToken = assignUserResetToken
exports.sendResetPasswordEmail = sendResetPasswordEmail
exports.resetPassword = resetPassword
exports.changePasswordReset = changePasswordReset
exports.sendSuccPassResetEmail = sendSuccPassResetEmail
exports.nodemailer = nodemailer
