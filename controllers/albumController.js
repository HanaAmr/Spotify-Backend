/** Express controller providing album related controls
 * @module controllers/album
 * @requires express
 */

/**
 * User controller to call when routing.
 * @type {object}
 * @const
 * @namespace albumController
 */

/**
 * express module
 * Album model from the database
 * @const
 */
const Album = require('./../models/albumModel')

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
 * express module
 * Track model from the database
 * @const
 */
const Track = require('./../models/trackModel')

/**
 * A function that is used to get albums with ids.
 * @memberof module:controllers/album~albumController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 * @return {JSON} Returns an array of albums in a json form.
 */
exports.getAlbumsWithIds = catchAsync(async (req, res, next) => {
  const ids = req.query._id.split(',')
  const features = new APIFeatures(Album.find().where('_id').in(ids), req.query)
  const albums = await features.query

  res.status(200).json({
    status: 'success',
    data: {
      albums
    }
  })
})

/**
 * A function that is used to get one album.
 * @memberof module:controllers/album~albumController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 * @return {JSON} Returns an album a json form.
 */
exports.getOneAlbum = catchAsync(async (req, res, next) => {
  const album = await Album.findById(req.params.albumId)

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
 * @memberof module:controllers/album~albumController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 * @return {JSON} Returns an array of the tracks of the album in a json form.
 */
exports.getAlbumTracks = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Track.find().where('album').in(req.params.albumId), req.query).paginate()
  const tracksArray = await features.query

  res.status(200).json({
    status: 'success',
    data: {
      tracksArray
    }
  })
})
