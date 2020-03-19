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