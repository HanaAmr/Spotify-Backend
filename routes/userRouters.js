/** Express router providing user related routes
 * @module routes/users
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express')

/**
 * User controller to call when routing.
 * @type {object}
 * @const
 */
const userController = require('../controllers/userController')

/**
 * Auth controller to call when routing.
 * @type {object}
 * @const
 */
const authController = require('../controllers/authController')

/**
 * express module
 * passport for connecting with facebook
 * @const
 */
const passport = require('passport');
const passportConf = require('../passport');

/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 * @namespace usersRouter
 */
const router = express.Router()

/**
 * Route for requesting to sign up
 * @name post/signUp
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - Sign up path
 * @param {callback} middleware - Sign up middleware.
 */
router.post('/signUp', authController.signUp)


/**
 * Route for requesting to login with facebook
 * @name post/loginWithFacebook
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - Sign up with facebook path
 * @param {callback} middleware - Sign up middleware.
 */
router.post('/loginWithFacebook', passport.authenticate('facebookToken', { session: false }), authController.loginWithFacebook)


/**
* Route for requesting to sign in
* @name post/signIn
* @function
* @memberof module:routes/users~usersRouter
* @inner
* @param {string} path - Sign in path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - Sign in middleware.
*/
router.post('/signIn', authController.signIn)
// router.post('/signIn', authController.protect, authController.restrictTo('artist'), authController.signIn);

/**
* Route for requesting to get user profile
* @name get/getMyProfile
* @function
* @memberof module:routes/users~usersRouter
* @inner
* @param {string} path - get my profile path
* @param {callback} middleware - get my profile middleware.
*/
/**
* Route for requesting to update user profile
* @name put/updateProfile
* @function
* @memberof module:routes/users~usersRouter
* @inner
* @param {string} path - update profile path
* @param {callback} middleware - update profile middleware.
*/
router
  .route('/me')
  .get(authController.protect, authController.getMyProfile)
  .put(authController.protect, authController.updateProfile)

  

/**
* Route for requesting to change user password
* @name put/changePassword
* @function
* @memberof module:routes/users~usersRouter
* @inner
* @param {string} path - change password path
* @param {callback} middleware - change password middleware.
*/
router.put('/me/changePassword', authController.protect, authController.changePassword)



/**
* Route for requesting to follow user
* @name put/followArtistUser
* @function
* @memberof module:routes/users~usersRouter
* @inner
* @param {string} path - follow user path
* @param {callback} middleware - follow user middleware.
*/
router.put('/me/following', authController.protect, authController.followArtistUser)



// POST request to reset the password by email.

/**
 * Route for requesting to reset password
 * @name post/resetPassword
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - Resetting password path
 * @param {callback} middleware - Reset Password middleware.
 */
router.post('/resetPassword', userController.requestResetPassword)

/**
 * Route for resetting password
 * @name post/resetPassword/:token
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - Resetting password path
 * @param {string} token - The reset password token
 * @param {callback} middleware - Reset Password middleware.
 */
router.post('/resetPassword/:token', userController.resetPassword)

/**
 * Route for requesting to become premium
 * @name post/me/premium
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - Becoming premium path
 * @param {callback} middleware - Upgrade user middleware
 */
router.post('/me/premium', authController.protect, authController.restrictTo('user'), userController.requestBecomePremium)

/**
 * Route for confirming upgrade
 * @name post/me/upgrade
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - Upgrade user path
 * @param {callback} middleware - Upgrade user middleware
 */
router.post('/me/upgrade/:confirmationCode', authController.protect, userController.confirmUpgrade)

/**
 * Route for requesting to cancel premium
 * @name post/me/premium
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - cancel premium path
 * @param {callback} middleware - Cancel upgrade middleware
 */
router.delete('/me/premium', authController.protect, authController.restrictTo('premium'), userController.cancelUpgrade)

/**
 * Route for confirming to cancel premium
 * @name post/me/premium
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - cancel premium path
 * @param {callback} middleware - Cancel upgrade middleware
 */
router.delete('/me/premium/:confirmationCode', authController.protect, authController.restrictTo('premium'), userController.confirmCancelUpgrade)

/**
 * Route for requesting to become artist
 * @name post/me/artist
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - Becoming artist path
 * @param {callback} middleware - Upgrade user middleware
 */
router.post('/me/artist', authController.protect, userController.requestBecomeArtist)

/**
 * Route for requesting to cancel artist
 * @name post/me/artist
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - cancel ugrade path
 * @param {callback} middleware - Cancel upgrade middleware
 */
router.delete('/me/artist', authController.protect, authController.restrictTo('artist'), userController.cancelUpgrade)

/**
 * Route for confirming to cancel artist
 * @name post/me/artist
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - cancel upgrade path
 * @param {callback} middleware - Cancel upgrade middleware
 */
router.delete('/me/artist/:confirmationCode', authController.protect, authController.restrictTo('artist'), userController.confirmCancelUpgrade)

module.exports = router
