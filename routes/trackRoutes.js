/** Express router providing album related routes
 * @module routes/category
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express')
/**
 * Express router to mount album related functions on.
 * @type {object}
 * @const
 * @namespace categoryRouter
 */
const router = express.Router()
/**
 * Track controller to call when routing.
 * @type {object}
 * @const
 */
const trackController = require('./../controllers/trackController')

/**
 * Route for requesting to get a track
 * @name get/tracks/:trackId
 * @function
 * @memberof module:routes/tracks~tracksRouter
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
 * @memberof module:routes/tracks~tracksRouter
 * @inner
 */
router
  .route('/')
  .get(trackController.getTracks)

module.exports = router
