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
  .route('/likes/daily/tracks/:id')
  .get(artistStatsController.getTrackDailyLikesStats)


router
  .route('/listens/daily/tracks/:id')
  .get(artistStatsController.getTrackDailyListensStats)

  router
    .route('/listens/daily/albums/:id')
    .get(artistStatsController.getAlbumDailyListensStats)


  router
    .route('/listens/monthly/tracks/:id')
    .get(artistStatsController.getTrackMonthlyListensStats)
  
  router
    .route('/likes/monthly/tracks/:id')
    .get(artistStatsController.getTrackMonthlyLikesStats)
    
  router
    .route('/listens/monthly/albums/:id')
    .get(artistStatsController.getAlbumMonthlyListensStats)

  router
    .route('/listens/yearly/tracks/:id')
    .get(artistStatsController.getTrackYearlyListensStats)

  router
    .route('/listens/yearly/albums/:id')
    .get(artistStatsController.getAlbumYearlyListensStats)

  module.exports = router
