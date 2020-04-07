/** Express router providing player related routes
 * @module routers/player
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
 * Route for adding a track to recently played
 * @name post/me/player/recentlyPlayed
 * @function
 * @memberof module:routers/player
 * @inner
 * @param {String} Path - The Express path
 * @param {Function} addToRecentlyPlayed - Adds currently played track to the recently played list for the user.
 */
router
  .route('/recentlyPlayed')
  .post(playerController.addToRecentlyPlayed)









/**
 * Route for adding a track to recently played
 * @name post/me/player/recentlyPlayed
 * @function
 * @memberof module:routers/player
 * @inner
 * @param {String} Path - The Express path
 * @param {Function} addToRecentlyPlayed - Adds currently played track to the recently played list for the user.
 */
router
  .route('/recentlyPlayed')
  .post(playerController.addToRecentlyPlayed)

  /**
 * Route for getting recently played tracks (play history)
 * @name get/me/player/recentlyPlayed
 * @function
 * @memberof module:routers/player
 * @inner
 * @param {String} Path - The Express path
 * @param {Function} getRecentlyPlayed - Gets the recently played list for the user.
 */
router
.route('/recentlyPlayed')
.get(playerController.getRecentlyPlayed)


module.exports = router
