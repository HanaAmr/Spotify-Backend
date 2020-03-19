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
 * A function that is used to reset password for users by sending them emails to change the password.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const resetPasswordSendMail = function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we are creating a random token then assign it to a user and send him an email with the link to reset the password.
  async.waterfall([async.apply(createTokenString, req, res, process.env.RESET_PASSWORD_TOKEN_SIZE), assignUserResetToken, sendResetPasswordEmail], (err) => {
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
const createTokenString = function (req, res, size, done) {
  crypto.randomBytes(parseInt(size,10), (err, buf) => {
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
      user.resetPasswordExpires = Date.now() + parseInt(process.env.RESET_PASSWORD_TOKEN_TIME,10)*1000 // 10 minutes (*1000 to be in ms)
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
  if(req.params.token === undefined) return done(new AppError('No token is provided', 404))
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

/**
 * A function that is used to become a premium user.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const becomePremium  = function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we are creating a verification code then assign it to the user and send him an email with the verification code.
  async.waterfall([async.apply(createTokenString, req, res, process.env.PREM_CONF_CODE_SIZE), assignUserPremConfigCode, sendPremiumConfigCodeEmail], (err) => {
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
 * A function that is used to assign verification code to premium to the user
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const assignUserPremConfigCode = function (req, res, code, done) {
  // Get passed user id from token
  const userId = jwt.decode(req.headers.authorization,process.env.JWT_SECRET)
  // Search for the user with the provided email in the db.
  //TODO: remove comment from here after testing User.findOne({ _id: userId }, (err, user) => {
  User.findOne({email: 'omarhadhoud@ymail.com'}, (err,user) => {
    if (err) {
      return done(new AppError('An unexpected error has occured : ' + req.body.email, 500))
    } else if (!user) { // If user doesn't exist
      return done(new AppError('No user with this email exists : ' + req.body.email, 404))
    } else {
      //Check that user isn't already premium
      if(user.role==='premium') return done(new AppError('User is already premium!', 400))
    // Update the user premium verification code and save changes
      user.becomePremiumToken = code
      user.becomePremiumExpires = Date.now() + parseInt(process.env.PREM_CONF_CODE_TIME,10)*1000 // 10 minutes (*1000 to be in ms)
      user.save((err) => {
        done(err, req, res, code, user)
      })
    }
  })
}

/**
 * A function that is used to send the premium verification code.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const sendPremiumConfigCodeEmail = function (req, res, code, user, done) {
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
    subject: 'Become a premium user verification email!',
    text: 'Hello.\n\nHere is the verification code that you need to become a premium user: ' +
           code + '\n\n' +
          ' If you didn\'t request to become premium, delete this email and change your password!\n All the best,\nSystem 424 Team \n'
  }
  // Sending the email
  smtpTransport.sendMail(mailOptions, (err) => {
    if (err) {
      console.log('Couldn\'t send the become premium code email')
      return done(new AppError('Couldn\'t send the email ', 502))
    } else console.log('Become premium code email sent\n')
    done(null)
  })
}

/**
 * A function that is used to check for the confirmation code to make the user a premium one.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const confirmBePremium = function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we change the password if valid, then send an email informing the user.
  async.waterfall([async.apply(makeUserRolePrem, req, res), sendSuccPremReqEmail], (err) => {
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
 * A function that is used to check if the confirmation code is valid and thus make the user a premium one.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
const makeUserRolePrem = function (req, res, done) {
  if(req.params.confirmationCode === undefined) return done(new AppError('No confirmation code is provided', 404))
  // Searching for the user with this confirmation code if not expired.
  User.findOne({ becomePremiumToken: req.params.confirmationCode, becomePremiumExpires: { $gt: Date.now() } }, (err, user) => {
    if (err) {
      console.log('Unexpected internal server error : ' + err)
      return done(new AppError('An internal server error has occurred.', 500))
    } else if (!user) { // If no user with this token is found (token is invalid)
      return done(new AppError('The code provided is not valid.', 404))
    } else if (req.body.confirmationCode === user.becomePremiumToken) {
      user.role = 'premium'
      // Reset token no longer exists
      user.becomePremiumToken = undefined
      user.becomePremiumExpires = undefined
      // Save the user account after changing the role to premium.
      user.save((err) => {
        done(err, req, res, user)
      })
    }
  })
}

/**
 * A function that is used to send email confirming changing the role to premium.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */

const sendSuccPremReqEmail = function (req, res, user, done) {
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
    subject: 'Welcome to Spotify Premium!',
    text: 'Hello,\n\n' +
        'This is a confirmation that you are now a premium user! \n\nHave fun, enjoy our music :)\n All the best, System-424 team\n' 
  }
  // Sending the email
  smtpTransport.sendMail(mailOptions, (err) => {
    if (err) {
      console.log('Couldn\'t send wlecoming premium email')
      return done(new AppError('Couldn\'t send the premium welcoming email.', 502))
    } else console.log('Premium welcoming Email sent\n')
    done(null)
  })
}




// Handling which module to export, to be able to export private functions when testing
const userController = {}

//Functions needed for production only
userController.prodExports = {
resetPasswordSendMail : resetPasswordSendMail,
resetPassword : resetPassword,
becomePremium : becomePremium
}
// Exporting the functions needed for unit testing
userController.testExports = {
resetPassword : resetPassword,
resetPasswordSendMail: resetPasswordSendMail,
createTokenString : createTokenString,
assignUserResetToken : assignUserResetToken,
sendResetPasswordEmail : sendResetPasswordEmail,
changePasswordReset : changePasswordReset,
sendSuccPassResetEmail : sendSuccPassResetEmail,
becomePremium : becomePremium,
assignUserPremConfigCode : assignUserPremConfigCode,
sendPremiumConfigCodeEmail : sendPremiumConfigCodeEmail,
nodemailer : nodemailer,
}


const exported = process.env.TEST ==='1' ? userController.testExports : userController.prodExports
module.exports = exported