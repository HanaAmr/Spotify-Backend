/** Express router providing album related routes
 * @module routes/category
 * @requires express
 */

/**
 * Category routes.
 * @type {object}
 * @const
 */

/**
 * express module
 * @const
 */
const express = require('express')

const router = express.Router()
/**
 * Category controller to call when routing.
 * @type {object}
 * @const
 */
const categoryController = require('./../controllers/categoryController')
/**
 * Authorization controller to call when routing.
 * @type {object}
 * @const
 */
const authController = require('./../controllers/authController')

/**
 * Middleware to check authorization
 * @function
 * @memberof module:routes/category
 * @inner
 */
//router.use(authController.protect)

/**
 * Route for requesting categories
 * @name get/browse/categories
 * @function
 * @memberof module:routes/category
 * @inner
 */
router
  .route('/')
  .get(categoryController.getAllCategories)

/**
 * Route for requesting a category's playlists
 * @name get/browse/categories/:categoryId/playlists
 * @function
 * @memberof module:routes/category
 * @inner
 * @param {string} id - Category ID
 */
router
  .route('/:categoryId/playlists')
  .get(categoryController.getCategoryPlaylist)

module.exports = router
