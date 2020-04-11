/**
 * For catching errors in asynchronous functions
 * @module utils/catchAsync
 * @requires express
 */

/**
 * catchAsync
 * @type {object}
 * @const
 */


/**
* For catching errors in asynchronous functions
* @alias module:utils/catchAsync
* @param {Function}  - the async function to catch errors thrwon in it.
*/
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}
