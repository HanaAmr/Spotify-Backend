
class AppError extends Error {

/**
 * App error class for handling errors
 * @class appError
 * @classdesc The app error to construct an error object
 * @param {String} message Message strig of the error
 * @param {String} statusCode Status code of the error
 */
  constructor (message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true
  }
}

module.exports = AppError
