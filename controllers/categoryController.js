/**
 * Controller module.
 * @module controllers
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
 * express module
 * Pagination file
 * @const
 */
const paginatedResults = require('./../utils/pagination')

/**
 * A function that is used to get all categories.
 * @memberof module:controllers~categoryController
 * @function getAllCategories
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 * @return {JSON} Returns an array of categories in a json form.
 */
exports.getAllCategories =catchAsync(async (req, res, next) => {  //  non paginated
  const features = new APIFeatures(Category.find(), req.query).paginate()
  const categories = await features.query.select("-__v")
  res.status(200).json({
    status: 'success',
    data: {
      categories
    }
  })
})

// exports.getAllCategories =catchAsync(async (req, res, next) => {  // paginated

//   const results=await paginatedResults(req,await Category.find().countDocuments().exec())
//   const features = new APIFeatures(Category.find(), req.query).paginate()
//   results.items = await features.query
//   res.status(200).json({
//     status: 'success',
//     data: {
//       results
//     }
//   })
// })

/**
 * A function that is used to get the playlists of the category.
 * @memberof module:controllers~categoryController
 * @function getCategoryPlaylist
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 * @return {JSON} Returns an array of playlists in a json form.
 */
exports.getCategoryPlaylist = catchAsync(async (req, res, next) => {  //  non paginated
  const category=await Category.findById(req.params.categoryId)
  
  if(!category){
    return next(new AppError('No category found with that ID', 404))
  }
  const features = new APIFeatures(Playlist.find({ category: req.params.categoryId }), req.query).paginate().limitFieldsPlaylist()
  const playlists = await features.query
  
  res.status(200).json({
    status: 'success',
    data: {
      playlists
    }
  })
})

// exports.getCategoryPlaylist = catchAsync(async (req, res, next) => { //  paginated
//   const results=await paginatedResults(req,await Playlist.find({ category: req.params.categoryId }).countDocuments().exec())
//   const features = new APIFeatures(Playlist.find({ category: req.params.categoryId }), req.query).paginate().limitFieldsPlaylist()
//   results.items = await features.query
  
//   res.status(200).json({
//     status: 'success',
//     data: {
//       results
//     }
//   })
// })
