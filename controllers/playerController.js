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
 * Player model from the database
 * @const
 */
const Player = require('../models/playerModel')
/**
 * Context model from the database
 * @const
 */
const Context = require('../models/contextModel')
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

/**
 * Pagination utils
 * @const
 */
const paginatedResults = require('./../utils/pagination')


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
  //Get the user context and save it to a new document
  const newContext = await playerService.getContext(userId)
  newContext._id = require('mongoose').Types.ObjectId()
  newContext.isNew = true
  await newContext.save()

  const currTrack = await playerService.getCurrentTrack(userId)
  const newPlayHistory = new PlayHistory({
    userId: userId,
    context: newContext._id,
    playedAt: Date.now(),
    track: currTrack
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
  const results = await paginatedResults(req, await PlayHistory.find().where('userId').equals(userId).countDocuments().exec())
  const features = new APIFeatures(PlayHistory.find().where('userId').sort({'playedAt':-1}).equals(userId), req.query).paginate()
  results.items = await features.query.select('-userId -_id -__v')
  res.status(200).json({
    status: 'success',
    data: {
      results
    }
  })
})


/**
 * Starts a playing context for the user.
 *  @alias module:controllers/player
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
exports.startContext = catchAsync(async function (req, res, next) {
  const userId = await userService.getUserId(req.headers.authorization)
  const tracksIds = await playerService.generateContext(req.body.id, req.body.type, userId)
  res.status(200).json({
    status: 'success',
    data: tracksIds
  })
})

/**
 * Skips the song in the queue without it counting to skips limit for free user.
 *  @alias module:controllers/player
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
exports.finishedTrack = catchAsync(async function (req, res, next) {
  const userId = await userService.getUserId(req.headers.authorization)
  playerService.finishTrack(userId, 1)
  res.status(204).send()
})


/**
 * Skips the song in the queue to the next track while decrementing skip limit.
 *  @alias module:controllers/player
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
exports.skipToNextTrack = catchAsync(async function (req, res, next) {
  const userId = await userService.getUserId(req.headers.authorization)
  const canSkip = await playerService.skipTrack(userId, 1)
  if (canSkip) res.status(204).send()
  else res.status(403).send()
})

/**
 * Skips the song in the queue to the previous track while decrementing skip limit.
 *  @alias module:controllers/player
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
exports.skipToPrevTrack = catchAsync(async function (req, res, next) {
  const userId = await userService.getUserId(req.headers.authorization)
  const canSkip = await playerService.skipTrack(userId, -1)
  if (canSkip) res.status(204).send()
  else res.status(403).send()
})

/**
 * Gets a random ad from the db and increments number of ads played.
 *  @alias module:controllers/player
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 */
exports.getAd = catchAsync(async function (req, res, next) {
  const userId = await userService.getUserId(req.headers.authorization)
  await playerService.incrementAdsPlayed(userId)
  const track = await playerService.getRandomAd()
  res.status(200).json({
    status: 'success',
    data: {
      track
    }
  })
})