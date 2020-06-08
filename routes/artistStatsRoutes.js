/** Express router providing artist statistics related routes
 * @module routes/artistStatsRoutes
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express')

/**
 * artistStats controller to call when routing.
 * @const
 */
const artistStatsController = require('./../controllers/artistStatsController')

/**
 * Authorization controller to call when routing.
 * @const
 */
const authController = require('./../controllers/authController')

/**
 * Express router to mount artistAlbus related functions on.
 * @const
 */
const router = express.Router()

/**
 * Middleware to check authorization
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router.use(authController.protect)

/**
 * Middleware to restrict this routes to only artist
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router.use(authController.restrictTo('artist'))

/**
 * Route for artist Track statitics 
 * @name /me/stats/Tracks/:id
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router
  .route('likes/daily/tracks/:id')
  .get(artistStatsController.getDailyTrackStats)

router
  .route('/listens/daily/tracks/:id')
  .get(artistStatsController.getTrackDailyListensStats)

  router
    .route('/listens/daily/albums/:id')
    .get(artistStatsController.getAlbumDailyListensStats)
  module.exports = router
