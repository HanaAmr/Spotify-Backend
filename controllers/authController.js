/** Express controller providing auth related controls
 * @module controllers/auth
 * @requires express
 */

/**
 * Auth controller to call when routing.
 * @type {object}
 * @const
 */

/**
 * util to import promisify function
 * @const
 */
const { promisify } = require('util')

/**
 * user object
 * @const
 */
const User = require('../models/userModel')

/**
 * jwt for tokens
 * @const
 */
const jwt = require('jsonwebtoken')

/**
 * catch async for async functions
 * @const
 */
const catchAsync = require('../utils/catchAsync')

/**
 * error object
 * @const
 */
const AppError = require('../utils/appError')

// generating token using user id
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
}

/**
* A function for signing up users
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.signUp = catchAsync(async (req, res, next) => {
  // create a new user with the input data
  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender
  })

  // generate a token for the new user
  const token = signToken(newUser._id)

  res.status(200).json({
    status: 'Success',
    success: true,
    expireDate: process.env.JWT_EXPIRE_IN,
    token
  })
})

/**
* A function for logging in users with facebook
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.loginWithFacebook = catchAsync(async (req, res, next) => {
  // if everything was fine generate and send a token to the user who logged in with facebook
  const token = signToken(req.user._id)

  res.status(200).json({
    status: 'Success',
    sucess: true,
    expireDate: process.env.JWT_EXPIRE_IN,
    token
  })
})

/**
* A function for signing in users
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email or password!', 400))
  }

  // check if email and password are correct
  const tempUser = await User.findOne({ email }).select('+password')
  if (!tempUser) {
    return next(new AppError('Incorrect email!', 401))
  }
  const correct = await tempUser.correctPassword(password, tempUser.password)
  if (!correct) {
    return next(new AppError('Incorrect password!', 401))
  }

  // generate and send token
  const token = signToken(tempUser._id)

  res.status(200).json({
    status: 'Success',
    success: true,
    expireDate: process.env.JWT_EXPIRE_IN,
    token
  })
})

/**
* A middleware function for token validation and verification
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.protect = catchAsync(async (req, res, next) => {
  let token

  // get token and check if it exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to access.', 401))
  }

  // verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET) // error handling

  // check if user still exists
  const freshUser = await User.findById(decoded.id)
  if (!freshUser) {
    return next(new AppError('The user belonging to this token does no longer exists', 401))
  }

  req.user = freshUser
  next()
})

/**
* A function that pass roles to a middleware function to check for authorization
* @alias module:controllers/auth
* @param {array} roles - The function takes the request as a parameter to access its body.
*/
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // check if the user role has a permission to a certain action
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403))
    }
    next()
  }
}

/**
* A function to get user profile
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getMyProfile = catchAsync(async (req, res, next) => {
  // get the user from database and send his data
  const newUser = await User.findById(req.user.id)

  res.status(200).json({
    name: newUser.name,
    email: newUser.email,
    gender: newUser.gender,
    dateOfBirth: newUser.dateOfBirth,
    images: newUser.images,
    followers: newUser.followers,
    following: newUser.following,
    uri: newUser.uri,
    href: newUser.href,
    userStats: newUser.userStats,
    artistInfo: newUser.artistInfo,
    role: newUser.role
  })
})

/**
* A function to change user password
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.changePassword = catchAsync(async (req, res, next) => {
  // get user from database
  const user = await User.findById(req.user.id).select('+password')

  // check if the user sent the newpassword and the currentpassword
  if (!req.body.passwordConfirmation || !req.body.newPassword) {
    return next(new AppError('Please enter the required inputs', 400))
  }

  // check if currentpassword is correct
  if (!(await user.correctPassword(req.body.passwordConfirmation, user.password))) {
    return next(new AppError('Your Confirmation password is wrong', 401))
  }

  // change the cuurent password with the new one
  user.password = req.body.newPassword
  await user.save()

  res.status(200).json({
    status: 'Success'
  })
})

/**
* A function to update user
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.updateProfile = catchAsync(async (req, res, next) => {
  // get user from database
  const user = await User.findById(req.user.id)

  // update the user data with the new data and send the updated user
  user.email = req.body.email
  user.name = req.body.name
  user.gender = req.body.gender
  user.dateOfBirth = req.body.dateOfBirth
  await user.save()

  res.status(200).json({
    status: 'Success',
    user
  })
})

/**
* A function to follow artist or user
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.followArtistUser = catchAsync(async (req, res, next) => {
  // get the requesting user and the user who is going to be followed from database
  const user = await User.findById(req.user.id)
  const followedUser = await User.findById(req.body.id)

  // check if the id of the followed user is given
  if (!followedUser) {
    return next(new AppError('Please enter the id of the user you want to follow', 400))
  }

  // check if it is not the first time to follow this user
  if (user.following.includes(req.body.id)) {
    return next(new AppError('Already following this user', 400))
  }

  // user follows the followed user
  user.following.push(req.body.id)
  followedUser.followers.push(req.user.id)

  await user.save()
  await followedUser.save()

  res.status(204).json({
    status: 'Success'
  })
})

exports.createUser = catchAsync(async (name, email, password) => {
  const newUser = await User.create({
    name: name,
    email: email,
    password: password
  })
  return newUser
})
