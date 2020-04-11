/** Express router providing artist's albums related routes
 * @module routes/astistAlbumsRoutes
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express')

/**
 * artistAlbum controller to call when routing.
 * @const
 */
const artistAlbumController = require('./../controllers/artistAlbumsController')

/**
 * uploadService that has uploading middlewares to call when routing
 * @const
 */
const uploadService = require('./../services/uploadService')

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
 *
 */
router.use(authController.restrictTo('artist'))

/**
 * Route for artist's albums
 * @name /me/albums
 * @function
 * @memberof module:routes/artistAlbumsRoutes
 * @inner
 */
router
  .route('/')
  .post(uploadService.uploadAlbumImage, artistAlbumController.addAlbum)
  .get(artistAlbumController.getArtistAlbums)

/**
  * Route for artist's albums tracks
  * @name /me/albums
  * @function
  * @memberof module:routes/artistAlbumsRoutes
  * @param {string} albumId - album id passed in query
  * @inner
  */
router
  .route('/:id/tracks')
  .post(uploadService.uploadTrackAudio, artistAlbumController.addTracktoAlbum)

module.exports = router
