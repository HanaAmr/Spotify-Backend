/** Express router providing user related routes
 * @module routes/users
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express');

/**
 * User controller to call when routing.
 * @type {object}
 * @const
 */
const authController = require('../controllers/authController');

/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 * @namespace usersRouter
 */
const router = express.Router();

/**
 * Route for requesting to sign up
 * @name post/signUp
 * @function
 * @memberof module:routes/users~usersRouter
 * @inner
 * @param {string} path - Sign up path
 * @param {callback} middleware - Sign up middleware.
 */
router.post('/signUp', authController.signUp);

/**
* Route for requesting to sign in
* @name post/signIn
* @function
* @memberof module:routes/users~usersRouter
* @inner
* @param {string} path - Sign in path
* @param {callback} middleware - Protect middleware.
* @param {callback} middleware - Sign in middleware.
*/
router.post('/signIn', authController.protect, authController.signIn);
//router.post('/signIn', authController.protect, authController.restrictTo('artist'), authController.signIn);

module.exports = router;