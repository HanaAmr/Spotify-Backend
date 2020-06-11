/** Express router providing playlist related routes
 * @module routes/playlist
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express')

const router = express.Router()
/**
 * Playlist controller to call when routing.
 * @type {object}
 * @const
 */
const playlistController = require('./../controllers/playlistController')

/**
 * Authorization controller to call when routing.
 * @type {object}
 * @const
 */
const authController = require('./../controllers/authController')

/**
 * Route for requesting to get top playlists
 * @name get/playlists/top
 * @function
 * @memberof module:routes/playlist
 * @inner
 */
router
  .route('/top')
  .get(playlistController.getSortedPlaylist)

/**
 * Route for requesting to get recommended playlists
 * @name get/playlists/recommended
 * @function
 * @memberof module:routes/playlist
 * @inner
 */
router
  .route('/recommended')
  .get(playlistController.getRecommendedPlaylists)

/**
 * Route for requesting to get a playlist
 * @name get/playlists/:playlistId
 * @function
 * @memberof module:routes/playlist
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
 * @memberof module:routes/playlist
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
 * @memberof module:routes/playlist
 * @inner
 * @param {string} id - PLaylist ID
 */
router
  .route('/:playlistId/tracks')
  .get(playlistController.getPlaylistTracks)

/**
 * Route for requesting to get recommended tracks for playlist
 * @name get/playlists/:playlistId/tracks/recommended
 * @function
 * @memberof module:routes/playlist
 * @inner
 * @param {string} id - PLaylist ID
 */
router
  .route('/:playlistId/tracks/recommended')
  .get(authController.protect, playlistController.getRecommendedPlaylistTracks)

module.exports = router
