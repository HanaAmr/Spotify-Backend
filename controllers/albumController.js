/**
 * Controller module.
 * @module controllers/album
 * @requires express
 */

/**
 * Album controller to call when routing.
 * @type {object}
 * @const
 */

/**
 * Album model from the database
 * @const
 */
const Album = require('./../models/albumModel')

/**
 * API features utils file
 * @const
 */
const APIFeatures = require('./../utils/apiFeatures')

/**
 * catchAsync utils file
 * @const
 */
const catchAsync = require('./../utils/catchAsync')

/**
 * Error handing module
 * @const
 */
const AppError = require('./../utils/appError')

/**
 * Track model from the database
 * @const
 */
const Track = require('./../models/trackModel')

/**
 * User model from the database
 * @const
 */
const User=require('./../models/userModel')

/**
 * user Service Class
 * @const
 */
const userService = require('./../services/userService')
const userServiceClass = new userService()


/**
 * A function that is used to get albums with ids.
 *  @alias module:controllers/album
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} albumId - The albumIds to search for.
 * @return {JSON} Returns an array of albums in a json form.
 */
exports.getAlbumsWithIds = catchAsync(async (req, res, next) => {
  const ids = req.query._id.split(',')
  const features = new APIFeatures(Album.find().where('_id').in(ids), req.query)
  const albums = await features.query.select('-__v').populate({
    path: 'artists',
    select: '_id name uri href externalUrls images role followers userStats artistInfo' // user public data

  })

  if (albums.length === 0) {
    return next(new AppError('No albums found with those IDs', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      albums
    }
  })
})

/**
 * A function that is used to get one album.
 *  @alias module:controllers/album
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} albumId - The albumId to search for.
 * @return {JSON} Returns an album a json form.
 */
exports.getOneAlbum = catchAsync(async (req, res, next) => {
  const album = await Album.findById(req.params.albumId).select('-__v').populate({
    path: 'artists',
    select: '_id name uri href externalUrls images role followers userStats artistInfo' // user public data

  })

  if (!album) {
    return next(new AppError('No album found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      album
    }
  })
})

/**
 * A function that is used to get the tracks of that album.
 *  @alias module:controllers/album
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} albumId - The albumId to search for.
 * @return {JSON} Returns an array of the tracks of the album in a json form.
 */
exports.getAlbumTracks = catchAsync(async (req, res, next) => { //  non paginated

  const album = await Album.findById(req.params.albumId)
  if (!album)
    return next(new AppError('No album found with that ID', 404))

  let artist=null
  if(req.headers.authorization)
  {
    const artistId = await (userServiceClass.getUserId(req.headers.authorization))
    artist = User.find({_id:artistId,role:'artist'})
  }
  
  
  const features = new APIFeatures(Track.find().where('album').in(req.params.albumId).select('-__v'), req.query).paginate().limitFieldsTracks()

  const tracksArray = await features.query

  if (tracksArray.length === 0 && !artist) {
    return next(new AppError('Album has no tracks', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      tracksArray
    }
  })
})

/**
 * A function that is used to get sorted albums.
 *  @alias module:controllers/album
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @return {JSON} Returns an array of the top albums in a json form.
 */
exports.getSortedAlbums = catchAsync(async (req, res, next) => { //  not paginated
  const features = new APIFeatures(Album.find({totalTracks: { $gt: 0 } }).select('-__v'), req.query).sort().paginate()
  const albums = await features.query.populate({
    path: 'artists',
    select: '_id name uri href externalUrls images role followers userStats artistInfo' // user public data

  })

  res.status(200).json({
    status: 'success',
    data: {
      albums
    }
  })
})

