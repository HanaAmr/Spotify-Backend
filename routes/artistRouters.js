/** Express router providing album related routes
 * @module routes/artistRouters
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
const artistViewingController=require('./../controllers/artistViewingController')

/**
 * Authorization controller to call when routing.
 * @type {object}
 * @const
 */
const authController = require('./../controllers/authController')

/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 * @namespace usersRouter
 */
const router=express.Router()
/**
 * Middleware to check authorization
 * @function
 * @memberof module:routes/tracks~tracksRouter
 * @inner
 */
router.use(authController.protect)


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

module.exports=router