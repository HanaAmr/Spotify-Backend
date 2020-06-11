/** Express router providing track related routes
 * @module routes/track
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express')

const router = express.Router()
/**
 * Track controller to call when routing.
 * @type {object}
 * @const
 */
const trackController = require('./../controllers/trackController')
/**
 * Authorization controller to call when routing.
 * @type {object}
 * @const
 */
const authController = require('./../controllers/authController')

/**
 * Middleware to check authorization
 * @function
 * @memberof module:routes/track
 * @inner
 */
// router.use(authController.protect)

/**
 * Route for requesting to get a track
 * @name get/tracks/:trackId
 * @function
 * @memberof module:routes/track
 * @inner
 * @param {string} id - PLaylist ID
 */
router
  .route('/:trackId')
  .get(trackController.getOneTrack)

/**
 * Route for requesting categories
 * @name get/tracks
 * @function
 * @memberof module:routes/track
 * @inner
 */
router
  .route('/')
  .get(trackController.getTracks)

/**
 * Route for requesting to get a track mp3 file
 * @name get/tracks/:trackId
 * @function
 * @memberof module:routes/track
 * @inner
 * @param {string} trackId - Track ID
 */
router
  .route('/:trackId/audio')
  .get(trackController.getOneTrackAudioFile)

module.exports = router
