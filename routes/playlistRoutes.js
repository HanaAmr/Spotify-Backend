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
 * Playlist controller to call when routing.
 * @type {object}
 * @const
 */
const playlistController = require('./../controllers/playlistController')

//  router.param('categoryId', categoryController.checkcategoryID)

/**
 * Route for requesting to get a playlist
 * @name get/playlists/:playlistId
 * @function
 * @memberof module:routes/playlist~playlistRouter
 * @inner
 * @param {string} id - PLaylist ID
 */
router
  .route('/:playlistId')
  .get(playlistController.getOnePlaylist)

/**
 * Route for requesting to get a playlist's image
 * @name get/playlists/:playlistId/image
 * @function
 * @memberof module:routes/playlist~playlistRouter
 * @inner
 * @param {string} id - PLaylist ID
 */
router
  .route('/:playlistId/image')
  .get(playlistController.getPlaylistImage)

/**
 * Route for requesting to get a playlist's tracks
 * @name get/playlists/:playlistId/tracks
 * @function
 * @memberof module:routes/playlist~playlistRouter
 * @inner
 * @param {string} id - PLaylist ID
 */
router
  .route('/:playlistId/tracks')
  .get(playlistController.getPlaylistTracks)

module.exports = router
