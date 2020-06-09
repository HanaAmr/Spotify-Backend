/**
 * Controller module.
 * @module controllers/artistStatsController
 * @requires express
 */

/**
 * Mongoose package
 * @const
 */
const mongoose = require('mongoose')

 /**
 * Album model from the database
 * @const
 */
const Album = require('../models/albumModel')

/**
 * Track model from the database
 * @const
 */
const Track = require('../models/trackModel')

/**
 * Error handing module
 * @const
 */
const AppError = require('../utils/appError')

/**
 * catch async function for handling async functions
 * @const
 */
const catchAsync = require('./../utils/catchAsync')

/**
 * Moment package for dealing with datess
 * @const
 */
const moment = require('moment')


/**
 * user Service Class used to get artist ID from token
 * @const
 */
const userService = require('./../services/userService')
const userServiceClass = new userService()

/**
 * artist Service Class for making the necessary calculation functions
 * @const
 */
const artistService = require('./../services/artistService')
const artistServiceClass = new artistService()

/**
 * A middleware function for getting last 30 days listens statitics for track uploaded by artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns an array of objects containing the day and number of listens per day
 */
exports.getTrackDailyListensStats=catchAsync(async (req, res, next) => {

  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const track= await Track.findById(req.params.id)
  if(!track)
      throw (new AppError('No track with this ID', 404))

  if(!(track.artists.includes(artistId)))
    throw (new AppError('You are not allowed to view statitics of tracks that are not yours', 401))

  listensDailyStats=await artistServiceClass.getDailyListensStats(track)
  
  res.status(200).json({
    status: 'success',
    data: listensDailyStats
  })

})

/**
 * A middleware function for getting last 30 days listens statitics for album uploaded by artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns an array of objects containing the day and number of listens per day
 */
exports.getAlbumDailyListensStats=catchAsync(async (req, res, next) => {

  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const album= await Album.findById(req.params.id)
  if(!album)
      throw (new AppError('No album with this ID', 404))

  if(!(album.artists.includes(artistId)))
    throw (new AppError('You are not allowed to view statitics of albums that are not yours', 401))

  listensDailyStats=await artistServiceClass.getDailyListensStats(album)
  
  res.status(200).json({
    status: 'success',
    data: listensDailyStats
  })

})

/**
 * A middleware function for getting last 30 days likes statitics for track uploaded by artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns an array of objects containing the day and number of listens per day
 */
exports.getTrackDailyLikesStats=catchAsync(async (req, res, next) => {

  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const track= await Track.findById(req.params.id)
  if(!track)
      throw (new AppError('No track with this ID', 404))

  if(!(track.artists.includes(artistId)))
    throw (new AppError('You are not allowed to view statitics of tracks that are not yours', 401))

  likesDailyStats=await artistServiceClass.getDalyLikesStats(track)
  
  res.status(200).json({
    status: 'success',
    data: likesDailyStats
  })

})

/**
 * A middleware function for getting last 30 days likes statitics for album uploaded by artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns an array of objects containing the day and number of listens per day
 */
exports.getAlbumDailyLikesStats=catchAsync(async (req, res, next) => {

  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const album= await Album.findById(req.params.id)
  if(!album)
      throw (new AppError('No album with this ID', 404))

  if(!(album.artists.includes(artistId)))
    throw (new AppError('You are not allowed to view statitics of albums that are not yours', 401))

  likesDailyStats=await artistServiceClass.getDalyLikesStats(album)
  
  res.status(200).json({
    status: 'success',
    data: likesDailyStats
  })

})

/**
 * A middleware function for getting last 12 month listens statitics for track uploaded by artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns an array of 12 objects containing the day and number of listens per month
 */
exports.getTrackMonthlyListensStats=catchAsync(async (req, res, next) => {

  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const track= await Track.findById(req.params.id)
  if(!track)
      throw (new AppError('No track with this ID', 404))

  if(!(track.artists.includes(artistId)))
    throw (new AppError('You are not allowed to view statitics of tracks that are not yours', 401))

  listensMonthlyStats=await artistServiceClass.getMonthlyOrYearlyListensStats(track,"monthly","listens")
  
  res.status(200).json({
    status: 'success',
    data: listensMonthlyStats
  })

})

/**
 * A middleware function for getting last 12 months listens statitics for album uploaded by artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns an array of 12 objects containing the day and number of listens per month
 */
exports.getAlbumMonthlyListensStats=catchAsync(async (req, res, next) => {

  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const album= await Album.findById(req.params.id)
  if(!album)
      throw (new AppError('No album with this ID', 404))

  if(!(album.artists.includes(artistId)))
    throw (new AppError('You are not allowed to view statitics of albums that are not yours', 401))

  listensMonthlyStats=await artistServiceClass.getMonthlyOrYearlyListensStats(album,"monthly","listens")
  
  res.status(200).json({
    status: 'success',
    data: listensMonthlyStats
  })

})

/**
 * A middleware function for getting last 12 months likes statitics for track uploaded by artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns an array of objects containing the day and number of likes per month
 */
exports.getTrackMonthlyLikesStats=catchAsync(async (req, res, next) => {

  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const track= await Track.findById(req.params.id)
  if(!track)
      throw (new AppError('No track with this ID', 404))

  if(!(track.artists.includes(artistId)))
    throw (new AppError('You are not allowed to view statitics of tracks that are not yours', 401))

  likesMonthlyStats=await artistServiceClass.getMonthlyOrYearlyListensStats(track,"monthly","likes")
  
  res.status(200).json({
    status: 'success',
    data: likesMonthlyStats
  })

})

/**
 * A middleware function for getting last 12 months likes statitics for album uploaded by artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns an array of objects containing the day and number of likes per month
 */
exports.getAlbumMonthlyLikesStats=catchAsync(async (req, res, next) => {

  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const album= await Album.findById(req.params.id)
  if(!album)
      throw (new AppError('No album with this ID', 404))

  if(!(album.artists.includes(artistId)))
    throw (new AppError('You are not allowed to view statitics of albums that are not yours', 401))

  likesMonthlyStats=await artistServiceClass.getMonthlyOrYearlyListensStats(album,"monthly","likes")
  
  res.status(200).json({
    status: 'success',
    data: likesMonthlyStats
  })

})

/**
 * A middleware function for getting last 5 years listens statitics for track uploaded by artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns an array of 12 objects containing the day and number of listens per year
 */
exports.getTrackYearlyListensStats=catchAsync(async (req, res, next) => {

  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const track= await Track.findById(req.params.id)
  if(!track)
      throw (new AppError('No track with this ID', 404))

  if(!(track.artists.includes(artistId)))
    throw (new AppError('You are not allowed to view statitics of tracks that are not yours', 401))

  listensMonthlyStats=await artistServiceClass.getMonthlyOrYearlyListensStats(track,"yearly","listens")
  
  res.status(200).json({
    status: 'success',
    data: listensMonthlyStats
  })

})

/**
 * A middleware function for getting last 12 months listens statitics for album uploaded by artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns an array of 12 objects containing the day and number of listens per year
 */
exports.getAlbumYearlyListensStats=catchAsync(async (req, res, next) => {

  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const album= await Album.findById(req.params.id)
  if(!album)
      throw (new AppError('No album with this ID', 404))

  if(!(album.artists.includes(artistId)))
    throw (new AppError('You are not allowed to view statitics of albums that are not yours', 401))

  const listensYearlyStats=await artistServiceClass.getMonthlyOrYearlyListensStats(album,"yearly","listens")
  
  res.status(200).json({
    status: 'success',
    data: listensYearlyStats
  })

})

/**
 * A middleware function for getting last 5 years likes statitics for track uploaded by artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns an array of 12 objects containing the day and number of listens per year
 */
exports.getTrackYearlyLikesStats=catchAsync(async (req, res, next) => {

  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const track= await Track.findById(req.params.id)
  if(!track)
      throw (new AppError('No track with this ID', 404))

  if(!(track.artists.includes(artistId)))
    throw (new AppError('You are not allowed to view statitics of tracks that are not yours', 401))

  listensMonthlyStats=await artistServiceClass.getMonthlyOrYearlyListensStats(track,"yearly","likes")
  
  res.status(200).json({
    status: 'success',
    data: listensMonthlyStats
  })

})
/**
 * A middleware function for getting last 5 years likes statitics for album uploaded by artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns an array of 12 objects containing the day and number of listens per year
 */
exports.getAlbumYearlyLikesStats=catchAsync(async (req, res, next) => {

  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const album= await Album.findById(req.params.id)
  if(!album)
      throw (new AppError('No album with this ID', 404))

  if(!(album.artists.includes(artistId)))
    throw (new AppError('You are not allowed to view statitics of albums that are not yours', 401))

  listensMonthlyStats=await artistServiceClass.getMonthlyOrYearlyListensStats(album,"yearly","likes")
  
  res.status(200).json({
    status: 'success',
    data: listensMonthlyStats
  })

})