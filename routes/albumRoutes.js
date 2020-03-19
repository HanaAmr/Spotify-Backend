/** Express router providing album related routes
 * @module routes/albums
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
 * @namespace albumRouter
 */
const router = express.Router()
/**
 * Album controller to call when routing.
 * @type {object}
 * @const
 */
const albumController = require('./../controllers/albumController')

/**
 * Route for requesting a specific album
 * @name get/albums/:albumId
 * @function
 * @memberof module:routes/albums~albumRouter
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
 * @memberof module:routes/albums~albumRouter
 * @inner
 */
router
  .route('/')
  .get(albumController.getAlbumsWithIds)

/**
 * Route for requesting a group of albums
 * @name get/albums/:albumId/tracks
 * @function
 * @memberof module:routes/albums~albumRouter
 * @param {string} albumId - Album ID
 * @inner
 */
router
  .route('/:albumId/tracks')
  .get(albumController.getAlbumTracks)

module.exports = router
