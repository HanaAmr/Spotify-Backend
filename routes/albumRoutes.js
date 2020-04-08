/** Express router providing album related routes
 * @module routes/albums
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express')
const router = express.Router()
/**
 * Album controller to call when routing.
 * @type {object}
 * @const
 */
const albumController = require('./../controllers/albumController')
/**
 * Authorization controller to call when routing.
 * @type {object}
 * @const
 */
const authController = require('./../controllers/authController')
/**
 * Middleware to check authorization
 * @function
 * @memberof module:routes/tracks~tracksRouter
 * @inner
 */
//router.use(authController.protect)

/**
 * Route for requesting top albums
 * @name get/albums/top
 * @function
 * @memberof module:routes/albums
 * @inner
 */
router
  .route('/top')
  .get(albumController.getSortedAlbums)

/**
 * Route for requesting a specific album
 * @name get/albums/:albumId
 * @function
 * @memberof module:routes/albums
 * @inner
 * @param {string} albumId - Album ID
 */
router
  .route('/:albumId')
  .get(albumController.getOneAlbum)

/**
 * Route for requesting a group of albums
 * @name get/albums
 * @function
 * @memberof module:routes/albums
 * @inner
 */
router
  .route('/')
  .get(albumController.getAlbumsWithIds)

/**
 * Route for requesting a group of albums
 * @name get/albums/:albumId/tracks
 * @function
 * @memberof module:routes/albums
 * @param {string} albumId - Album ID
 * @inner
 */
router
  .route('/:albumId/tracks')
  .get(albumController.getAlbumTracks)

module.exports = router
