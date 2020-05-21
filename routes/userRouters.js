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
const passport = require('passport')
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
* @param {callback} middleware - Sign in middleware.
*/
router.post('/signIn', authController.signIn)



/**
* Route for requesting to get user profile
* @name get/getUserProfile
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - get user profile path
* @param {callback} middleware - get user profile middleware.
*/
router.get('/users/:id', authController.getUserProfile)



/**
* Route for requesting to get my profile
* @name get/getMyProfile
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - get my profile path
* @param {callback} middleware - Protect middleware.
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
* @param {callback} middleware - Protect middleware.
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
* @param {callback} middleware - Protect middleware.
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
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - follow user middleware.
*/
router.put('/me/following', authController.protect, authController.followArtistUser)

/**
* Route for getting followed users
* @name get/me/following
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - follow user path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - follow user middleware.
*/
router.get('/me/following', authController.protect, authController.getfollowedArtistUser)

/**
* Route for getting user's followers
* @name get/me/followers
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - follow user path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - follow user middleware.
*/
router.get('/me/followers', authController.protect, authController.getUserfollowers)


/**
* Route for requesting to unfollow user
* @name delete/unfollowArtistUser
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - unfollow user path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - unfollow user middleware.
*/
router.delete('/me/following', authController.protect, authController.unfollowArtistUser)


/**
* Route for requesting to like track
* @name put/likeTrack
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - like track path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - like track middleware.
*/
router.put('/me/likeTrack', authController.protect, authController.likeTrack)

/**
* Route for getting to liked tracks
* @name get/me/likedTracks
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - like track path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - get liked tracks middleware.
*/
router.get('/me/likedTracks', authController.protect, authController.getLikedTracks)


/**
* Route for requesting to unlike track
* @name delete/unlikeTrack
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - unlike track path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - unlike track middleware.
*/
router.delete('/me/unlikeTrack', authController.protect, authController.unlikeTrack)


/**
* Route for requesting to like album
* @name put/likeAlbum
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - like album path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - like album middleware.
*/
router.put('/me/likeAlbum', authController.protect, authController.likeAlbum)

/**
* Route for getting liked albums
* @name get/me/likedAlbums
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - like album path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - get liked albums middleware.
*/
router.get('/me/likedAlbums', authController.protect, authController.getLikedAlbums)



/**
* Route for requesting to unlike album
* @name delete/unlikeAlbum
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - unlike album path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - unlike album middleware.
*/
router.delete('/me/unlikeAlbum', authController.protect, authController.unlikeAlbum)



/**
* Route for requesting to like playlist
* @name put/likePlaylist
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - like playlist path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - like playlist middleware.
*/
router.put('/me/likePlaylist', authController.protect, authController.likePlaylist)

/**
* Route for getting liked playlists
* @name get/me/likedPlaylists
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - like playlists path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - get liked playlists middleware.
*/
router.get('/me/likedPlaylists', authController.protect, authController.getLikedPlaylists)


/**
* Route for requesting to unlike playlist
* @name delete/unlikePlaylist
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - unlike playlist path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - unlike playlist middleware.
*/
router.delete('/me/unlikePlaylist', authController.protect, authController.unlikePlaylist)



/**
* Route for requesting to remove image
* @name delete/removeImage
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - remove image path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - remove image middleware.
*/
router.delete('/me/image', authController.protect, authController.removeImage)


/**
* Route for requesting to change image
* @name put/changeImage
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - change image path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - change image middleware.
*/
router.put('/me/image', authController.protect, authController.changeImage)



/**
* Route for requesting to create a playlist
* @name post/createPlaylist
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - create a playlist path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - create a playlist middleware.
*/
router.post('/users/playlists', authController.protect, authController.createPlaylist)


/**
* Route for requesting to add track to a playlist
* @name post/addTrackToPlaylist
* @function
* @memberof module:routes/users
* @inner
* @param {string} path - add track to a playlist path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - add track to a playlist middleware.
*/
router.post('/playlists/:playlistId/tracks', authController.protect, authController.addTrackToPlaylist)



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
 * @name delete/me/artist
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Request to cancel artist membership path
 * @param {function} cancelUpgrade - Requests to cancel premium subscription.
 */
router.delete('/me/artist', authController.protect, authController.restrictTo('artist'), userController.cancelUpgrade)

/**
 * Route for confirming to cancel artist
 * @name delete/me/artist
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Confirm cancel artist path
 * @param {function} confirmCancelUpgrade -  Cancels artist membership for the user.
 */
router.delete('/me/artist/:confirmationCode', authController.protect, authController.restrictTo('artist'), userController.confirmCancelUpgrade)

/**
 * Route for updating notifications token of user
 * @name put/me/notifications/token
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Request to update the notifications token.
 * @param {function} updateNotificationsToken - Requests to update the notifications token.
 */
router.put('/me/notifications/token', authController.protect, userController.updateNotificationsToken)

/**
 * Route for getting notifications of user
 * @name get/me/notifications
 * @function
 * @memberof module:routes/users
 * @inner
 * @param {string} path - Request to get the notifications of the user.
 * @param {function} getNotifications - Requests to get the notifications of the user.
 */
router.get('/me/notifications', authController.protect, userController.getNotifications)

module.exports = router
