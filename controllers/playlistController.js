/**
 * playlistController module.
 * @module playlistController
 * @requires express
 */

/**
 * Playlist controller to call when routing.
 * @type {object}
 * @const
 * @namespace playlistController
 */

/**
 * express module
 * Playlist model from the database
 * @const
 */
const Playlist = require('./../models/playlistModel')

/**
 * express module
 * Track model from the database
 * @const
 */
const Track = require('./../models/trackModel')

/**
 * express module
 * API features utils file
 * @const
 */
const APIFeatures = require('./../utils/apiFeatures')

/**
 * express module
 * catchAsync utils file
 * @const
 */
const catchAsync = require('./../utils/catchAsync')

/**
 * express module
 * AppError class file
 * @const
 */
const AppError = require('./../utils/appError')

/**
 * Get one Playlist given its ID
 * @memberof module:controllers/playlist~playlistController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 * @return {JSON} The details of the playlist in a json form.
 */
exports.getOnePlaylist = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Playlist.findById(req.params.playlistId), req.query).limitField()
  const playlist = await features.query.select('-tracks').populate({
    path: 'trackObjects'
  })

  if (!playlist) {
    return next(new AppError('No playlist found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      playlist
    }
  })
})

/**
 * A function that is used to get playlist images.
 * @memberof module:controllers/playlist~playlistController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 * @return {string} The image of the playlist in string format
 */
exports.getPlaylistImage = catchAsync(async (req, res, next) => {
  const query = Playlist.findById(req.params.playlistId)
  const images = await query.select('images')
  // const images = await query

  if (!images) {
    return next(new AppError('This playlist has no images', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      images
    }
  })
})

/**
 * Get the tracks of a playlist given its ID
 * @memberof module:controllers/playlist~playlistController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 * @return {JSON} Returns an array of the tracks inside this playlist.
 */
exports.getPlaylistTracks = catchAsync(async (req, res, next) => {
  let query = Playlist.findById(req.params.playlistId)
  query = await query.select('trackObjects')
  const features = new APIFeatures(Track.find().where('_id').in(query.trackObjects), req.query).limitField().paginate()

  const tracksArray = await features.query

  res.status(200).json({
    status: 'success',
    data: {
      tracksArray
    }
  })
})
