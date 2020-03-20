/**
 * errorController module.
 * @module errorController
 * @requires express
 */

/**
 * Category controller to call when routing.
 * @type {object}
 * @const
 * @namespace errorController
 */

/**
 * express module
 * AppError class file
 * @const
 */
const AppError = require('./../utils/appError')
/**
* A function for handling Cast Errors  in production environment
* @function
* @memberof module:controllers/errorController
* @param {error} - the error passed from the function
* @param {Respond} - The response sent
*/
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 404)
}
/**
* A function for handling mongoose validation errors in production environment
* @function
* @memberof module:controllers/errorController
* @param {error} - the error passed from the function
* @param {Respond} - The response sent
*/
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message)

  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

/**
* A function for handling errors in development environment
* @function
* @memberof module:controllers/errorController
* @param {error} - the error passed from the function
* @param {Respond} - The response sent
*/
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

/**
* A function for handling errors in production environment
* @function
* @memberof module:controllers/errorController
* @param {error} - the error passed from the function
* @param {Respond} - The response sent
*/
const sendErrorProd = (err, res) => { //    Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    //console.error('ERROR ', err)
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    })
  }
}

/**
* A middleware function for handling errors
* @function
* @memberof module:controllers/errorController
* @param {error} - the error passed from the function
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error)
      return sendErrorProd(error, res)
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error)
      return sendErrorProd(error, res)
    }

    return sendErrorProd(err, res)
  }
}
