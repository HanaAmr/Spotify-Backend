/** Express router providing authorization related controles
 * @module routes/users
 * @requires express
 */

 /**
 * express module
 * util to import promisify function
 * @const
 */
const { promisify } = require('util');

/**
 * express module
 * user object
 * @const
 */
const user = require('../models/user');

/**
 * express module
 * jwt for tokens
 * @const
 */
const jwt = require('jsonwebtoken');

/**
 * express module
 * catch async for async functions
 * @const
 */
const catchAsync = require('../utils/catchAsync');

/**
 * express module
 * error object
 * @const
 */
const AppError = require('../utils/appError');

//generating token using user id
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN });
};

/**
* A function for signing up users
* @function
* @memberof module:controllers/authController
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.signUp = catchAsync (async (req, res, next) => {
 const newUser = await user.create(req.body);   //edit body
 
 const token = signToken(newUser._id);

  res.status(200).json({
    status: 'Success',
    token,
    data: {
      success: true
    }    
  });
});

/**
* A function for signing in users
* @function
* @memberof module:controllers/authController
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.signIn = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    
    //check if email and password exist
    if(!email || !password) {
        return next(new AppError('Please provide email or password!', 400));
    }
    
    const tempUser = await user.findOne({email}).select('+password');
    const correct = await tempUser.correctPassword(password, tempUser.password);
    
    //check if email and password are correct
    if(!tempUser || !correct){
      return next(new AppError('Incorrect email or password!', 401));
    }
    
    //generate and send token
    const token = signToken(tempUser._id);

    res.status(200).json({
        status: 'Success',
        token,
        data: {
          success: true
        }   
    });
});

/**
* A middleware function for token validation and verification
* @function
* @memberof module:controllers/authController
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.protect = catchAsync (async (req, res, next) => {
    let token;
    
    //get token and check if it exists
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if(!token) {
      return next(new AppError('You are not logged in! Please log in to access.', 401));
    }
    
    //verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    //check if user still exists
    const freshUser = await user.findById(decoded.id);
    if (!freshUser) {
      return next(new AppError('The user belonging to this token does no longer exists', 401));
    }
    
    req.user = freshUser;
    next();
});

/**
* A function that pass roles to a middleware function to check for authorization
* @function
* @memberof module:controllers/authController
* @param {array} roles - The function takes the request as a parameter to access its body.
*/
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      if(!roles.includes(req.user.role)) {
        return next(new AppError('You do not have permission to perform this action', 403));
      }
      next();
    };
};