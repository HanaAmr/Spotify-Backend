/** Express middlware providing user premium related functions
 * @module middlware/users/premium
 * @requires express
 */

/**
 * express module
 * User model from the database
 * @const
 */
const User = require('../../models/user')

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
const AppError = require('../../utils/appError')



/**
 * A function that is used to create a random secure token
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
exports.createTokenString = function (req, res, size, next) {
  crypto.randomBytes(parseInt(size,10), (err, buf) => {
    const token = buf.toString('hex')
    next(err, req, res, token)
  })
}


/**
 * A function that is used to assign verification code to premium to the user
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
exports.assignPremiumConfirmCode = function (req, res, code, next) {
    // Get passed user id from token
    const userId = jwt.decode(req.headers.authorization,process.env.JWT_SECRET)
    console.log('the user id is : ' + userId)
    // Search for the user with the provided email in the db.
    User.findOne({ _id: userId }, (err, user) => {
      if (err) {
        return next(new AppError('An unexpected error has occured : ' + req.body.email, 500))
      } else if (!user) { // If user doesn't exist
        return next(new AppError('Couldn\'t find the user', 404))
      } else {
        //Check that user isn't already premium
        if(user.role==='premium') return next(new AppError('User is already premium!', 400))
      // Update the user premium verification code and save changes
        user.becomePremiumToken = code
        user.becomePremiumExpires = Date.now() + parseInt(process.env.PREM_CONF_CODE_TIME,10)*1000 // 10 minutes (*1000 to be in ms)
        user.save((err) => {
          next(err, req, res, code, user)
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
  exports.sendPremiumConfirmCodeMail = function (req, res, code, user, next) {
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
        return next(new AppError('Couldn\'t send the email ', 502))
      } else console.log('Become premium code email sent\n')
      next(null)
    })
  }

  
/**
 * A function that is used to check if the confirmation code is valid and thus make the user a premium one.
 * @memberof module:controllers/users~userController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
exports.changeRoleToPremium = function (req, res, next) {
  // Getting the current user Id from his authorization token
    const userId = jwt.decode(req.headers.authorization,process.env.JWT_SECRET)
    if(req.body.confirmationCode === undefined) return next(new AppError('No confirmation code is provided', 404))
    // Searching for the user with this confirmation code if not expired.
    User.findOne({_id : userId, becomePremiumToken: req.body.confirmationCode, becomePremiumExpires: { $gt: Date.now() } }, (err, user) => {
      if (err) {
        console.log('Unexpected internal server error : ' + err)
        return next(new AppError('An internal server error has occurred.', 500))
      } else if (!user) { // If no user with this token is found (token is invalid)
        return next(new AppError('The code provided is not valid.', 404))
      } else if (req.body.confirmationCode === user.becomePremiumToken) {
        user.role = 'premium'
        // Reset token no longer exists
        user.becomePremiumToken = undefined
        user.becomePremiumExpires = undefined
        // Save the user account after changing the role to premium.
        user.save((err) => {
          next(err, req, res, user)
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
  
  exports.sendSuccPremiumMail = function (req, res, user, next) {
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
        return next(new AppError('Couldn\'t send the premium welcoming email.', 502))
      } else console.log('Premium welcoming Email sent\n')
      next(null)
    })
  }
  