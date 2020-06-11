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
 * Route for artist daily listens stats for track
 * @name /me/stats/listens/daily/Tracks/:id
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router
  .route('/listens/daily/tracks/:id')
  .get(artistStatsController.getTrackDailyListensStats)

/**
 * Route for artist daily listens stats for album
 * @name /me/stats/listens/daily/album/:id
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router
  .route('/listens/daily/albums/:id')
  .get(artistStatsController.getAlbumDailyListensStats)

/**
 * Route for artist daily likes stats for track
 * @name /me/stats/likes/daily/tracks/:id
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router
  .route('/likes/daily/tracks/:id')
  .get(artistStatsController.getTrackDailyLikesStats)

/**
 * Route for artist daily likes stats for album
 * @name /me/stats/likes/daily/albums/:id
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router
  .route('/likes/daily/albums/:id')
  .get(artistStatsController.getAlbumDailyLikesStats)

/**
 * Route for artist monthly listens stats for track
 * @name /me/stats/listens/monthly/track/:id
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router
  .route('/listens/monthly/tracks/:id')
  .get(artistStatsController.getTrackMonthlyListensStats)

/**
 * Route for artist monthly listens stats for album
 * @name /me/stats/listens/monthly/albums/:id
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router
  .route('/listens/monthly/albums/:id')
  .get(artistStatsController.getAlbumMonthlyListensStats)

/**
 * Route for artist monthly likes stats for track
 * @name /me/stats/likes/monthly/tracks/:id
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router
  .route('/likes/monthly/tracks/:id')
  .get(artistStatsController.getTrackMonthlyLikesStats)

/**
 * Route for artist monthly likes stats for album
 * @name /me/stats/likes/monthly/albums/:id
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router
  .route('/likes/monthly/albums/:id')
  .get(artistStatsController.getAlbumMonthlyLikesStats)

/**
 * Route for artist yearly listens stats for track
 * @name /me/stats/listens/yearly/tracks/:id
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router
  .route('/listens/yearly/tracks/:id')
  .get(artistStatsController.getTrackYearlyListensStats)

/**
 * Route for artist yearly listens stats for album
 * @name /me/stats/listens/yearly/albums/:id
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router
  .route('/listens/yearly/albums/:id')
  .get(artistStatsController.getAlbumYearlyListensStats)

/**
 * Route for artist yearly likes stats for album
 * @name /me/stats/likes/yearly/tracks/:id
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router
  .route('/likes/yearly/tracks/:id')
  .get(artistStatsController.getTrackYearlyLikesStats)

/**
 * Route for artist yearly likes stats for album
 * @name /me/stats/likes/yearly/albums/:id
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router
  .route('/likes/yearly/albums/:id')
  .get(artistStatsController.getAlbumYearlyLikesStats)

module.exports = router
