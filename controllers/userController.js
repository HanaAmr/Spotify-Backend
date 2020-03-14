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
 * Error schema to create errors to send
 * @const
 */
const Error = require('../models/error')

/**
 * A function that is used to reset password for users by sending them emails to change the password.
 *
 *
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */

exports.resetPasswordSendMail = function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we are creating a random token then assign it to a user and send him an email with the link to reset the password.
  async.waterfall([async.apply(createTokenString, req, res), assignUserResetToken, sendResetPasswordEmail], (err) => {
    if (err) return next(err)
    else return res.status(204)
  })
}

/**
 * A function that is used to create a random secure token
 *
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 *
 */
createTokenString = function (req, res, done) {
  crypto.randomBytes(20, (err, buf) => {
    const token = buf.toString('hex')
    done(err, req, res, token)
  })
}

/**
 * A function that is used to assign reset password token to a certain user
 *
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 *
 */
assignUserResetToken = function (req, res, token, done) {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      res.status(404)
      const errorToSend = new Error({ status: 404, message: 'No user with this email exists.' })
      res.json(errorToSend)
      return res
    }

    // Update the user resetPassword token and save changes
    user.resetPasswordToken = token
    user.resetPasswordExpires = Date.now() + 3600000 // 1 Hour = 60 min * 60 sec = 3600000 ms
    user.save((err) => {
      done(err, token, user, req, res)
    })
  })
}

/**
 * A function that is used to send the reset password email to the user.
 *
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 *
 */
sendResetPasswordEmail = function (token, user, req, res, done) {
  // Creating transporting method for nodemailer
  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAILUSR,
      pass: process.env.GMAILPW
    }
  })

  const mailOptions = {
    to: user.email,
    from: process.env.GMAILUSR,
    subject: 'Reset your Spotify password',
    text: 'Hello.\n\nNo need to worry, you can reset your Spotify password by clicking the link below: ' +
          'http://' + req.headers.host + '/resetPassword/' + token + '\n\n' +
          ' If you didn\'t request a password reset, feel free to delete this email and carry on enjoying your music!\n All the best,\nSystem 424 Team \n'
  }

  smtpTransport.sendMail(mailOptions, (err) => {
    if (err) {
      console.log('Couldn\'t send email')
      res.status(502)
      const errorToSend = new Error({ status: 502, message: "Couldn\'t send the email. Try again." })
      res.json(errorToSend)
      return res
    } else console.log('Reset Email sent\n')
    done(err, 'done')
  })
}

/**
 * A function that is used to change password for users after requesting to reset it.
 *
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 *
 */
exports.resetPassword = function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we change the password if valid, then send an email informing the user.
  async.waterfall([async.apply(changePasswordReset, req, res), sendSuccPassResetEmail], (err) => {
    if (err) return next(err)
    else return res.status(204)
  })
}

/**
 * A function that is used to change the password after resetting in the db.
 *
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
changePasswordReset = function (req, res, done) {
  // Searching for the user with this reset token if not expired.
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      res.status(404)
      const errorToSend = new Error({ status: 502, message: 'The token provided is not valid.' })
      res.json(errorToSend)
      return res
    }

    if (req.body.newPassword === req.body.passwordConfirmation) {
      // TODO: call the function that sets the password when done
      user.password = req.body.newPassword
      // Reset token no longer exists
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined

      // Save the user account after changing the password.
      user.save((err) => {
        done(err, req, res, user)
        // TODO: should be logged in with the login function
      })
    } else {
      res.status(403)
      const errorToSend = new Error({ status: 502, message: "Passwords don\'t match." })
      res.json(errorToSend)
      return res
    }
  })
}

/**
 * A function that is used to send email confirming changing the password.
 *
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */

sendSuccPassResetEmail = function (req, res, user, done) {
  var smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAILUSR,
      pass: process.env.GMAILPW
    }
  })
  var mailOptions = {
    to: user.email,
    from: process.env.GMAILUSR,
    subject: 'Your password has been changed',
    text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
  }
  smtpTransport.sendMail(mailOptions, (err) => {
    if (err) {
      console.log('Couldn\'t send email')
      res.status(502)
      const errorToSend = new Error({ status: 502, message: "Couldn\'t send the confirming email." })
      res.json(errorToSend)
      return res
    } else console.log('Reset confirming Email sent\n')
    done(err, 'done')
  })
}
