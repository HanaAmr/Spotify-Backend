/** Express router providing album related routes
 * @module routes/artistAlbumsRoutes
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express')

/**
 * User service
 * @type {object}
 * @const
 */
const userService = require('./../services/userService')
/**
 * artistAlbum controller to call when routing.
 * @type {object}
 * @const
 */
const artistAlbumController = require('./../controllers/artistAlbumsController')

/**
 * uploadService that has uploading middlewares
 * @type {object}
 * @const
 */
const uploadService = require('./../services/uploadService')

/**
 * Authorization controller to call when routing.
 * @type {object}
 * @const
 */
const authController = require('./../controllers/authController')

/**
 * Express router to mount artistAlbus related functions on.
 * @type {object}
 * @const
 * @namespace artistAlbumsRouter
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
// router.use(authController.restrictTo('artist'))

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

// /**
//  * Route for artist's albums tracks
//  * @name /me/albums
//  * @function
//  * @memberof module:routes/artistAlbumsRoutes
//  * @inner
//  */
// router
//     .route('/:id/tracks')
//     .post(uploadService.uploadTrackAudio,artistAlbumController.addTracktoAlbum)
//     .get(artistAlbumController.getAlbumTracks)

module.exports = router
