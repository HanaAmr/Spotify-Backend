/**
 * Controller module.
 * @module controllers/playlist
 * @requires express
 */

/**
 * PLaylist controller to call when routing.
 * @type {object}
 * @const
 */

/**
 * Playlist model from the database
 * @const
 */
const Playlist = require('./../models/playlistModel')

/**
 * Track model from the database
 * @const
 */
const Track = require('./../models/trackModel')

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
 * AppError class file
 * @const
 */
const AppError = require('./../utils/appError')

// /**
//  * Pagination file
//  * @const
//  */
// const paginatedResults = require('./../utils/pagination')

/**
 * Get one Playlist given its ID
 *  @alias module:controllers/playlist
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} playlistId - The playlistId to search for.
 * @return {JSON} The details of the playlist in a json form.
 */
exports.getOnePlaylist = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Playlist.findById(req.params.playlistId), req.query).limitFieldsPlaylist()
  const playlist = await features.query

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
 *  @alias module:controllers/playlist
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} playlistId - The playlistId to search for.
 * @return {string} The image of the playlist in string format
 */
exports.getPlaylistImage = catchAsync(async (req, res, next) => {
  const query = Playlist.findById(req.params.playlistId)
  const images = await query.select('images').select('-_id')

  if (!images) {
    return next(new AppError('This playlist has no images', 404))
  }

  return res.status(200).json({
    status: 'success',
    data: {
      images
    }
  })
})

/**
 * Get the tracks of a playlist given its ID
 *  @alias module:controllers/playlist
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} playlistId - The playlistId to search for.
 * @return {JSON} Returns an array of the tracks inside this playlist.
 */
exports.getPlaylistTracks = catchAsync(async (req, res, next) => { //  not paginated
  let query = Playlist.findById(req.params.playlistId)
  query = await query.select('trackObjects')
  const features = new APIFeatures(Track.find().where('_id').in(query.trackObjects), req.query).limitFieldsTracks().paginate()

  const tracksArray = await features.query

  res.status(200).json({
    status: 'success',
    data: {
      tracksArray
    }
  })
})

// exports.getPlaylistTracks = catchAsync(async (req, res, next) => { //  paginated

//   let query = Playlist.findById(req.params.playlistId)
//   query = await query.select('trackObjects')

//   const results=await paginatedResults(req,await Track.find().where('_id').in(query.trackObjects).countDocuments().exec())

//   const features = new APIFeatures(Track.find().where('_id').in(query.trackObjects), req.query).limitFieldsTracks().paginate()

//   results.items = await features.query

//   res.status(200).json({
//     status: 'success',
//     data: {
//       results
//     }
//   })
// })

/**
 * Get the top playlists
 *  @alias module:controllers/playlist
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @return {JSON} Returns an array of the top playlists.
 */
exports.getSortedPlaylist = catchAsync(async (req, res, next) => { //  not paginated
  const features = new APIFeatures(Playlist.find(), req.query).sort().limitFieldsPlaylist().paginate()
  const playlist = await features.query

  res.status(200).json({
    status: 'success',
    data: {
      playlist
    }
  })
})

// exports.getSortedPlaylist = catchAsync(async (req, res, next) => { //  paginated
//   console.log(req.originalUrl)
//   const results=await paginatedResults(req,await Playlist.find().countDocuments().exec())

//   const features = new APIFeatures(Playlist.find(), req.query).sort().limitFieldsPlaylist().paginate()
//   results.items = await features.query

//   res.status(200).json({
//     status: 'success',
//     data: {
//       results
//     }
//   })
// })
