/** Express router providing album related routes
 * This module needs to authorization to access the endpoints
 * @module routes/artistRoutes
 * @requires express
 */

 /**
 * express module
 * @const
 */
const express=require('express')

/**
 * ArtistViewing controller to call when routing.
 * @type {object}
 * @const
 */
const artistViewingController=require('../controllers/artistViewingController')

/**
 * Express router to mount artist related functions on.
 * @type {object}
 * @const
 * @namespace artistRouter
 */
const router=express.Router()



/**
 * Route for requesting artists
 * @name /artists/
 * @function
 * @memberof module:routes/artistRouters
 * @inner
 */
router
    .route('/')
    .get(artistViewingController.getArtists)

/**
 * Route for requesting a specific album
 * @name /artists/:artistId
 * @function
 * @memberof module:routes/artistRouters
 * @inner
 * @param {string} artistId - artist ID
 */
router
    .route('/:id')
    .get(artistViewingController.getArtist)


/**
 * Route for requesting a specific album
 * @name /artists/:artistId/related-artists
 * @function
 * @memberof module:routes/artistRouters
 * @inner
 * @param {string} artistId - artist ID
 */
router
    .route('/:id/related-artists')
    .get(artistViewingController.getRelatedArtists)


/**
 * Route for requesting a specific album
 * @name /artists/:artistId/ralbums
 * @function
 * @memberof module:routes/artistRouters
 * @inner
 * @param {string} artistId - artist ID
 */
router
    .route('/:id/albums')
    .get(artistViewingController.getArtistAlbums)

/**
 * Route for requesting a specific album
 * @name /artists/:artistId/top-tracks
 * @function
 * @memberof module:routes/artistRouters
 * @inner
 * @param {string} artistId - artist ID
 */
router
    .route('/:id/top-tracks')
    .get(artistViewingController.getArtistTopTracks)

router
    .route('/:id/created-playlists')
    .get(artistViewingController.getArtistCreatedPlaylists)

/**
 * Route for requesting a specific album
 * @name /artists/:artistId/artist-created-playlists
 * @function
 * @memberof module:routes/artistRouters
 * @inner
 * @param {string} artistId - artist ID
 */


module.exports=router