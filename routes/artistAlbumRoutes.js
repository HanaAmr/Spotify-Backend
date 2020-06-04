/** Express router providing artist's albums related routes
 * @module routes/artistAlbumsRoutes
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
 * album controller to call when routing.
 * @const
 */
const albumController = require('./../controllers/albumController')
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
  * Route for specific album
  * @name /me/albums
  * @function
  * @memberof module:routes/artistAlbumsRoutes
  * @param {string} albumId - album id passed in query
  * @inner
  */
router
.route('/:id')
.delete(artistAlbumController.deleteAlbum)
.patch(uploadService.updateAlbumImage,artistAlbumController.editAlbum)

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
  .get(albumController.getAlbumTracks)
  .post(uploadService.uploadTrackAudio, artistAlbumController.addTracktoAlbum)


/**
  * Route for specific album
  * @name /me/albums
  * @function
  * @memberof module:routes/artistAlbumsRoutes
  * @param {string} albumId - album id passed in query
  * @param {string} trackID - track id passed in query
  * @inner
  */
router
  .route('/:albumId/tracks/:id')
  .delete(artistAlbumController.deleteTrack)
  .patch(artistAlbumController.editTrack)

module.exports = router
