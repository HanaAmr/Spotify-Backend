/**
 * categoryController module.
 * @module categoryController
 * @requires express
 */

/**
 * Category controller to call when routing.
 * @type {object}
 * @const
 * @namespace categoryController
 */

/**
 * express module
 * Category model from the database
 * @const
 */
const Category = require('./../models/categoryModel')

/**
 * express module
 * Playlist model from the database
 * @const
 */
const Playlist = require('./../models/playlistModel')
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
 * A function that is used to get all categories.
 * @memberof module:controllers/category~categoryController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 * @return {JSON} Returns an array of categories in a json form.
 */
exports.getAllCategories = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Category.find(), req.query).paginate()
  const categories = await features.query
  res.status(200).json({
    status: 'success',
    data: {
      categories
    }
  })
})

/**
 * A function that is used to get the playlists of the category.
 * @memberof module:controllers/category~categoryController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 * @return {JSON} Returns an array of playlists in a json form.
 */
exports.getCategoryPlaylist = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Playlist.find({ category: req.params.categoryId }), req.query).paginate().limitFieldsPlaylist()
  const playlists = await features.query// .select('-trackObjects')

  if (playlists.length === 0) {
    return next(new AppError('This category has no playlists', 404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      playlists
    }
  })
})
