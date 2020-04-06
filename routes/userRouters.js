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
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 * @namespace usersRouter
 */
const router = express.Router()

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
const passportConfig = require('../passport')

/**
 * Route for requesting to sign up
 * @name post/signUp
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Sign up path
 * @param {callback} middleware - Sign up middleware.
 */
router.post('/signUp', authController.signUp)


/**
 * Route for requesting to login with facebook
 * @name post/loginWithFacebook
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Sign up with facebook path
 * @param {callback} middleware - Sign up middleware.
 */
router.post('/loginWithFacebook', passport.authenticate('facebookToken', { session: false }), authController.loginWithFacebook)


/**
* Route for requesting to sign in
* @name post/signIn
* @function
* @memberof module:routes/users
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
* @memberof module:routes/users
* @inner
* @param {string} path - get my profile path
* @param {callback} middleware - get my profile middleware.
*/
router.get('/me', authController.protect, authController.getMyProfile)


/**
* Route for requesting to update user profile
* @name put/updateProfile
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - update profile path
* @param {callback} middleware - update profile middleware.
*/
router.put('/me', authController.protect, authController.updateProfile)
  

/**
* Route for requesting to change user password
* @name put/changePassword
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - change password path
* @param {callback} middleware - change password middleware.
*/
router.put('/me/changePassword', authController.protect, authController.changePassword)



/**
* Route for requesting to follow user
* @name put/followArtistUser
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - follow user path
* @param {callback} middleware - follow user middleware.
*/
router.put('/me/following', authController.protect, authController.followArtistUser)



/**
 * Route for requesting to reset password
 * @name post/resetPassword
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Request to reset password path
 * @param {Function} requestResetPassword - Requests to reset the password for the user.
 */
router.post('/resetPassword', userController.requestResetPassword)

/**
 * Route for resetting password
 * @name post/resetPassword/:token
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Resetting password path
 * @param {function} resetPassword - Resets the password for the user given he had a valid token.
 */
router.post('/resetPassword/:token', userController.resetPassword)

/**
 * Route for requesting to become premium
 * @name post/me/premium
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Becoming premium path
 * @param {function} requestBecomePremium - Requests upgrade to become a premium user.
 */
router.post('/me/premium', authController.protect, authController.restrictTo('user'), userController.requestBecomePremium)

/**
 * Route for confirming upgrade
 * @name post/me/upgrade
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Confirm upgrade user path
 * @param {function} confirmUpgrade - Confirms user upgrade to either premium or artist membership.
 */
router.post('/me/upgrade/:confirmationCode', authController.protect, userController.confirmUpgrade)

/**
 * Route for requesting to cancel premium
 * @name post/me/premium
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Request to cancel premium membership path
 * @param {function} cancelUpgrade - Requests to cancel premium subscription.
 */
router.delete('/me/premium', authController.protect, authController.restrictTo('premium'), userController.cancelUpgrade)

/**
 * Route for confirming to cancel premium
 * @name post/me/premium
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Confirm cancel premium path
 * @param {function} confirmCancelUpgrade - Cancels premium subscription for the user.
 */
router.delete('/me/premium/:confirmationCode', authController.protect, authController.restrictTo('premium'), userController.confirmCancelUpgrade)

/**
 * Route for requesting to become artist
 * @name post/me/artist
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Becoming artist path
 * @param {function} requestBecomeArtist - Requests upgrade to become an artist user.
 */
router.post('/me/artist', authController.protect, userController.requestBecomeArtist)

/**
 * Route for requesting to cancel artist
 * @name post/me/artist
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Request to cancel artist membership path
 * @param {function} cancelUpgrade - Requests to cancel premium subscription.
 */
router.delete('/me/artist', authController.protect, authController.restrictTo('artist'), userController.cancelUpgrade)

/**
 * Route for confirming to cancel artist
 * @name post/me/artist
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Confirm cancel artist path
 * @param {function} confirmCancelUpgrade -  Cancels artist membership for the user.
 */
router.delete('/me/artist/:confirmationCode', authController.protect, authController.restrictTo('artist'), userController.confirmCancelUpgrade)

module.exports = router
