/** Express controller providing user related controls
 * @module controllers/user
 * @requires express
 */

/**
 * User controller to call when routing.
 * @type {object}
 * @const
 */

/**
 * catch async for async functions
 * @const
 */
const catchAsync = require('../utils/catchAsync')

/**
 * User services
 * @const
 */
const UserServices = require('../services/userService')
const userService = new UserServices()

/**
 * AppError class file
 * @const
 */
const AppError = require('./../utils/appError')

/**
 * Mailer services
 * @const
 */
const MailerServices = require('../services/mailerService')
const mailerService = new MailerServices()

/**
 * Resets password for users by sending them emails to change the password.
 * @alias module:controllers/user
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
const requestResetPassword = catchAsync(async function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we are creating a random token then assign it to a user and send him an email with the link to reset the password.
  const token = await userService.createTokenString(parseInt(process.env.RESET_PASSWORD_TOKEN_SIZE, 10))
  await userService.assignResetToken(token, req.body.email)
  // E-Mail subject and text to be sent
  const subject = 'Reset your Spotify password'

  const text = 'Hello.\n\nNo need to worry, you can reset your Spotify password by clicking the link below: ' +
    'http://' + req.headers.host + '/resetPassword/' + token + '\n\n' +
    ' If you didn\'t request a password reset, feel free to delete this email and carry on enjoying your music!\n All the best,\nSystem 424 Team \n'

  await mailerService.sendMail(req.body.email, subject, text)
  // If everything is fine, send an empty body code 204.
  res.status(204).send()
})

/**
 * Changes password for users after requesting to reset it.
 * @alias module:controllers/user
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
const resetPassword = catchAsync(async function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we change the password if valid, then send an email informing the user.
  if (req.params.token === undefined) return next(new AppError('No token is provided', 404))
  const email = await userService.resetChangePassword(req.params.token, req.body.newPassword, req.body.passwordConfirmation)

  // E-mail, subject and text
  const subject = 'Your password has been changed'
  const text = 'Hello,\n\n' +
    'This is a confirmation that the password for your account has just been changed.\n'

  await mailerService.sendMail(email, subject, text)

  // If everything is fine, send empty body with status 204
  res.status(204).send()
})

/**
 * Becomes a premium user.
 * @alias module:controllers/user
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
const requestBecomePremium = catchAsync(async function (req, res, next) {
  // Calling the ugrade user function with premium as upgrade role.
  await upgradeUser(req, res, 'premium', next)
})

/**
 * Becomes an artist user.
 * @alias module:controllers/user
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
const requestBecomeArtist = catchAsync(async function (req, res, next) {
  // Calling the ugrade user function with premium as upgrade role.
  await upgradeUser(req, res, 'artist', next)
})

/**
 *Upgrades user.
 * @alias module:controllers/user
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
const upgradeUser = async function (req, res, upgradeRole, next) {
  // Calling asynchronous functions one after another
  // At first we are creating a verification code then assign it to the user and send him an email with the verification code.
  // async.waterfall([async.apply(upgradeMiddleware.createTokenString, req, res, process.env.PREM_CONF_CODE_SIZE, upgradeRole), upgradeMiddleware.assignUpgradeConfirmCode, upgradeMiddleware.sendUpgradeConfirmCodeMail], (err) => {
  const token = await userService.createTokenString(parseInt(process.env.PREM_CONF_CODE_SIZE, 10))
  await userService.assignUpgradeConfirmCode(req.headers.authorization, token, upgradeRole)

  // E-Mail subject and text to be sent
  const email = await userService.getUserMail(req.headers.authorization)
  const subject = `${upgradeRole} upgrade verification email!`
  const text = `Hello.\n\nHere is the verification code that you need for ${upgradeRole} upgrade: ` +
    token + '\n\n' +
    ` If you didn't request to upgrade to ${upgradeRole}, delete this email and change your password!\n All the best,\nSystem 424 Team \n`
  await mailerService.sendMail(email, subject, text)

  // If everything is fine, send an empty body code 204.
  res.status(204).send()
}

/**
 * Checks for the confirmation code to make the user a premium/artist one.
 * @alias module:controllers/user
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
const confirmUpgrade = catchAsync(async function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we change the password if valid, then send an email informing the user.
  await userService.upgradeUserRole(req.headers.authorization, req.params.confirmationCode)
  // E-Mail subject and text to be sent
  const email = await userService.getUserMail(req.headers.authorization)
  const role = await userService.getUserRole(req.headers.authorization)
  const subject = `Welcome to Spotify ${role}!`
  const text = 'Hello,\n\n' +
    `This is a confirmation that you are now ${role}! \n\nHave fun, enjoy our music :)\n All the best, System-424 team\n`
  await mailerService.sendMail(email, subject, text)

  // If no error happens
  res.status(204).send()
})

/**
 * Cancels premium/artist subscription.
 * @alias module:controllers/user
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
const cancelUpgrade = catchAsync(async function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we are creating a verification code then assign it to the user and send him an email with the verification code.
  const token = await userService.createTokenString(parseInt(process.env.PREM_CONF_CODE_SIZE, 10))
  await userService.assignUpgradeConfirmCode(req.headers.authorization, token, 'premium')
  // E-Mail subject and text to be sent]
  const role = await userService.getUserRole(req.headers.authorization)
  const email = await userService.getUserMail(req.headers.authorization)
  const subject = `Cancel ${role} subscription mail!`
  const text = `Hello.\n\nHere is the verification code that you need to cancel your ${role} subscription: ` +
  token + '\n\n' +
 ` If you didn't request to cancel ${role}, delete this email and change your password!\n All the best,\nSystem 424 Team \n`
  await mailerService.sendMail(email, subject, text)

  // If everything is fine, send an empty body code 204.
  res.status(204).send()
})

/**
 * Checks for the cancellation code to make the user a normal one.
 * @alias module:controllers/user
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
const confirmCancelUpgrade = catchAsync(async function (req, res, next) {
  // Calling asynchronous functions one after another
  // At first we change the password if valid, then send an email informing the user.
  // async.waterfall([async.apply(upgradeMiddleware.changeRoleToUser, req, res), upgradeMiddleware.sendSuccCancelMail], (err) => {
  await userService.changeRoleToUser(req.headers.authorization, req.params.confirmationCode)
  // E-Mail subject and text to be sent
  const email = await userService.getUserMail(req.headers.authorization)
  const subject = 'You\'re now a normal user!'
  const text = 'Hello,\n\n' +
 'This is a confirmation that you are now a normal user like before! \n\nHave fun, enjoy our music :)\n All the best, System-424 team\n'
  await mailerService.sendMail(email, subject, text)

  // If no error
  res.status(204).send()
})

// Handling which module to export
const userController = {}

// Functions needed for production only
userController.prodExports = {
  requestResetPassword: requestResetPassword,
  resetPassword: resetPassword,
  requestBecomePremium: requestBecomePremium,
  requestBecomeArtist: requestBecomeArtist,
  confirmUpgrade: confirmUpgrade,
  cancelUpgrade: cancelUpgrade,
  confirmCancelUpgrade: confirmCancelUpgrade
}

const exported = userController.prodExports
module.exports = exported
