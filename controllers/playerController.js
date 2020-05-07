/**
 * Controller module.
 * @module controllers/player
 * @requires express
 */

/**
 * Player controller to call when routing.
 * @type {object}
 * @const
 */

/**
 * Play History model from the database
 * @const
 */
const PlayHistory = require('../models/playHistoryModel')
/**
 * Track model from the database
 * @const
 */
const Track = require('../models/trackModel')

/**
 * catchAsync utils file
 * @const
 */
const catchAsync = require('../utils/catchAsync')

/**
 * APIFeatures utils file
 * @const
 */
const APIFeatures = require('../utils/apiFeatures')

/**
 * User services
 * @const
 */
const UserServices = require('../services/userService')
const userService = new UserServices()

/**
 * Player services
 * @const
 */
const PlayerServices = require('../services/playerService')
const playerService = new PlayerServices()

/**
 * @const
 */
const AppError = require('../utils/appError')

// /**
//  * Pagination file
//  * @const
//  */
// const paginatedResults = require('./../utils/pagination')

/**
 * Adds a track to the recently played list
 *  @alias module:controllers/player
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
exports.addToRecentlyPlayed = catchAsync(async function (req, res, next) {
  const userId = await userService.getUserId(req.headers.authorization)
  // Make sure list of recently played is freed if it has reached the limit
  await playerService.deleteOneRecentlyPlayedIfFull(userId)
  // TODO: Instead of getting the context from the request, we should have it saved
  // when the user started playing
  // const newContext = await playerService.getConext(userId)

  // For now, we generate the context here
  const newContext = await playerService.generateContext(req.body.contextUri, req.body.contextType)
  if (!newContext) throw new AppError(`Couldn't generate context. ${req.body.contextType} uri doesn't exist`, 404)
  const track = await Track.find().where('uri').equals(req.body.trackUri).select('_id')
  if (track.length === 0) {
    return next(new AppError('No track with this uri was found!', 404))
  }
  const newPlayHistory = new PlayHistory({
    userId: userId,
    context: newContext._id,
    playedAt: Date.now(),
    track: track[0]._id
  })
  await newPlayHistory.save()
  // Update the context's playHistoryId
  newContext.playHistoryId = newPlayHistory._id
  await newContext.save()

  res.status(204).send()
})

/**
 * Gets the recently played list
 *  @alias module:controllers/player
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
exports.getRecentlyPlayed = catchAsync(async function (req, res, next) {
  const userId = await userService.getUserId(req.headers.authorization)
  const features = new APIFeatures(PlayHistory.find().where('userId').equals(userId).select('-userId -_id'), req.query).limitFields().paginate()
  const items = await features.query
  res.status(200).json({
    status: 'success',
    data: {
      items
    }
  })
})

// /**
//  * A function that is used to get the recently played list
//   *  @alias module:controllers/player
//  * @param {Request}  - The function takes the request as a parameter to access its body.
//  * @param {Respond} - The respond sent
//  * @param {next} - The next function in the middleware
//  */
// exports.getRecentlyPlayed = catchAsync(async function (req, res, next) { //Paginated
//   const userId = await userService.getUserId(req.headers.authorization)
//   const results = await paginatedResults(req, await PlayHistory.find().where('userId').equals(userId).countDocuments().exec())
//   const features = new APIFeatures(PlayHistory.find().where('userId').equals(userId), req.query).paginate()
//   results.items = await features.query.select('-userId -_id -__v')
//   res.status(200).json({
//     status: 'success',
//     data: {
//       results
//     }
//   })
// })


/**
 * Starts a playing context for the user.
 *  @alias module:controllers/player
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
exports.startContext = catchAsync(async function (req, res, next) {
  const userId = await userService.getUserId(req.headers.authorization)
  const tracksUris = await playerService.generateContext(req.body.uri, req.body.type, userId)
  res.status(200).json({
    status: 'success',
    data: {
      tracksUris
    }
  })
})