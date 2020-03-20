/**
* For catching errors in asynchronous functions
* @function
* @memberof module:utils/catchAsync
* @param {Async function}  - the async function to catch errors thrwon in it.
*/
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}
