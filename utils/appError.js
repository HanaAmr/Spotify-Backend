/** App error class for handling errors
 * @module module:utils/appError
 * @requires express
 */
class AppError extends Error {
/**
 * @constructor
 */
  constructor (message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true
    // Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError
