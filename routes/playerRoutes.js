/** Express router providing player related routes
 * @module routes/player
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express')
/**
 * Express router to mount player related functions on.
 * @type {object}
 * @const
 */
const router = express.Router()
/**
 * Playlist controller to call when routing.
 * @type {object}
 * @const
 */
const playerController = require('../controllers/playerController')

/**
 * Authorization controller to call when routing.
 * @type {object}
 * @const
 */
const authController = require('./../controllers/authController')

/**
 * Route for adding a track to recently played
 * @name post/me/player/recentlyPlayed
 * @function
 * @memberof module:routes/player
 * @inner
 * @param {String} Path - The Express path
 * @param {Function} addToRecentlyPlayed - Adds currently played track to the recently played list for the user.
 */
router.post('/recentlyPlayed', authController.protect, playerController.addToRecentlyPlayed)

/**
 * Route for getting recently played tracks (play history)
 * @name get/me/player/recentlyPlayed
 * @function
 * @memberof module:routes/player
 * @inner
 * @param {String} Path - The Express path
 * @param {Function} getRecentlyPlayed - Gets the recently played list for the user.
 */
router.get('/recentlyPlayed', authController.protect, playerController.getRecentlyPlayed)

/**
 * Route for starting a playing context
 * @name put/me/player/play
 * @function
 * @memberof module:routes/player
 * @inner
 * @param {String} Type - The type of the context "Playlist/Artist/Album".
 * @param {String} Uri - The uri of the context.
 * @param {Function} startContext - Starts a playing context for the user.
 */
router.put('/play', authController.protect, playerController.startContext)

/**
 * Route when track being played is finished normally
 * @name post/me/player/finished
 * @function
 * @memberof module:routes/player
 * @inner
 * @param {Function} finishedTrack - Skips the song in the queue without it counting to skips limit for free user.
 */
router.post('/finished', authController.protect, playerController.finishedTrack)

/**
 * Route for skipping the track to the next one
 * @name post/me/player/next
 * @function
 * @memberof module:routes/player
 * @inner
 * @param {Function} skipToNextTrack - Skips the song in the queue to the next track while decrementing skip limit.
 */
router.post('/next', authController.protect, playerController.skipToNextTrack)

/**
 * Route for skipping the track to the previous one
 * @name post/me/player/previous
 * @function
 * @memberof module:routes/player
 * @inner
 * @param {Function} skipToPrevTrack - Skips the song in the queue to the previous track while decrementing skip limit.
 */
router.post('/previous', authController.protect, playerController.skipToPrevTrack)

/**
 * Route for getting a random ad
 * @name put/me/player/ad
 * @function
 * @memberof module:routes/player
 * @inner
 * @param {Function} getAd - Gets a random add from the db.
 */
router.get('/ad', authController.protect, playerController.getAd)

module.exports = router
