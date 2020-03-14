/** Express router providing user related routes
 * @module routes/users
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express')

/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 * @namespace usersRouter
 */
const router = express.Router()

/**
 * User controller to call when routing.
 * @type {object}
 * @const
 */
const userController = require('../controllers/userController')

// POST request to reset the password by email.

/**
 * Route for requesting to reset password
 * @name post/resetPassword
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - Resetting password path
 * @param {callback} middleware - Reset Password middleware.
 */
router.post('/resetPassword', userController.resetPasswordSendMail)

/**
 * Route for resetting password
 * @name post/resetPassword/:token
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - Resetting password path
 * @param {string} token - The reset password token
 * @param {callback} middleware - Reset Password middleware.
 */
router.post('/resetPassword/:token', userController.resetPassword)

module.exports = router
