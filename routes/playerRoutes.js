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
 * @namespace playerRouter
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
 * @memberof module:routes/player~playerRouter
 * @inner
 * @param {Request} Request - The function takes the request as a parameter to access its body.
 */
router
  .route('/recentlyPlayed')
  .post(playerController.addToRecentlyPlayed)

  /**
 * Route for getting recently played tracks (play history)
 * @name get/me/player/recentlyPlayed
 * @function
 * @memberof module:routes/player~playerRouter
 * @inner
 */
router
.route('/recentlyPlayed')
.get(playerController.getRecentlyPlayed)


module.exports = router
