/** Express router providing search for tracks
 * @module routes/search
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express')
const router = express.Router()

/**
 * Search controller to call when routing.
 * @type {object}
 * @const
 */
const searchController = require('./../controllers/searchController')

/**
 * Route for searching for tracks
 * @name get/search
 * @function
 * @memberof module:routes/search
 * @inner
 */
router
  .route('/')
  .get(searchController.getSearchedForTracks)


module.exports = router  
