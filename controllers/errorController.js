// const AppError = require('./../utils/appError')

// const handleCastErrorDB = err => {
//   const message = `Invalid ${err.path}: ${err.value}.`
//   return new AppError(message, 400)
// }

// const handleValidationErrorDB = err => {
//   const errors = Object.values(err.errors).map(el => el.message)

//   const message = `Invalid input data. ${errors.join('. ')}`
//   return new AppError(message, 400)
// }

// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack
//   })
// }

// const sendErrorProd = (err, res) => { //    Operational, trusted error: send message to client
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message
//     })
//   } else {
//     console.error('ERROR ', err)
//     res.status(500).json({
//       status: 'error',
//       message: 'Something went wrong!'
//     })
//   }
// }

// module.exports = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500
//   err.status = err.status || 'error'
//   if (process.env.NODE_ENV === 'development') {
//     sendErrorDev(err, res)
//   } else if (process.env.NODE_ENV === 'production') {
//     let error = { ...err }

//     if (error.name === 'CastError') {
//       error = handleCastErrorDB(error)
//       sendErrorProd(error, res)
//     }
//     if (error.name === 'ValidationError') {
//       error = handleValidationErrorDB(error)
//       sendErrorProd(error, res)
//     }

//     sendErrorProd(err, res)
//   }
// }
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
  err.statusCode = err.statusCode || 500; //server error
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
     status: err.status,
     message: err.message 
  });
} 