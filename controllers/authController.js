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
const User = require('../models/userModel');

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
  const newUser = await User.create(req.body);   //edit body
  
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
* A function to check if a user signed up with facebook
* @function
* @memberof module:controllers/authController
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.checkSignedupWithFacebook = catchAsync (async (req, res, next) => {
  const checkUser = await User.findOne({email: req.body.email});  
  
  const exist = checkUser ? true : false;
 
  res.status(200).json({
    status: 'Success',
    data: {
      exist
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
    
    //check if email and password are correct
    const tempUser = await User.findOne({email}).select('+password');
    if(!tempUser){
      return next(new AppError('Incorrect email!', 401));
    }
    const correct = await tempUser.correctPassword(password, tempUser.password);
    if(!correct){
      return next(new AppError('Incorrect password!', 401));
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
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);  //error handling
    
    //check if user still exists
    const freshUser = await User.findById(decoded.id);
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


/**
* A function that returns the database document id of the user that has the token passed to it.
* @function
* @memberof module:controllers/authController
* @param {String} token - The token string.
*/

exports.createUser = catchAsync (async (name, email, password) => {
  const newUser = await User.create({
    name: name,
    email: email,
    password: password
  });
  return newUser
})
/**
* A function that returns the userId of the current user
* @function
* @memberof module:controllers/authController
* @param {Request} req - The request which contains the token string.
*/

exports.getUserId = (async (req, next) => { //Not putting catchAsync as we need this function to be async to be able to wait for it in other controllers
  //get token and check if it exists
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if(!token) {
    return next(new AppError('You are not logged in! Please log in to access.', 401));
  }
  
  //verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  userId = decoded.id

  if(typeof next === 'function') {
    return Promise.resolve(next(userId))
  }
  return new Promise(resolve => {
      resolve(userId)
  })
})

/**
* A function that returns the role of the current user
* @function
* @memberof module:controllers/authController
* @param {Request} req - The request which contains the token string.
*/

exports.getUserRole = (async (req, next) => { //Not putting catchAsync as we need this function to be async to be able to wait for it in other controllers
  //get token and check if it exists
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if(!token) {
    return next(new AppError('You are not logged in! Please log in to access.', 401));
  }
  
  //verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  userId = decoded.id
  userRole = User.findById(userId).select('-_id role')
  if(typeof next === 'function') {
    return Promise.resolve(next(userRole))
  }
  return new Promise(resolve => {
      resolve(userRole)
  })
})