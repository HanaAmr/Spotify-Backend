/**
 * Controller module.
 * @module controllers/search
 * @requires express
 */

/**
 * Search controller to call when routing.
 * @type {object}
 * @const
 */

/**
 * Track model from the database
 * @const
 */
const Track = require('./../models/trackModel')

/**
 * AppError class file
 * @const
 */
const AppError = require('./../utils/appError')

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
 * Search Service file
 * @const
 */
const searchService = require('./../services/searchService')

/**
 * Pagination utils
 * @const
 */
const paginatedResults = require('./../utils/pagination')


/**
 * Search for tracks
 * @alias module:controllers/search
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @return {JSON} The details of the tracks in a json form.
 */
exports.getSearchedForTracks = catchAsync(async (req, res, next) => {

    if(!req.query.q)
    {
        return next(new AppError('Please enter a keyword to search with', 404))
    }
    
    let idArray = await searchService(req.query.q)

    // if (idArray.length==0) {
    //   return next(new AppError('No tracks found', 404))
    // }

    const results=await paginatedResults(req,await Track.find().where('_id').in(idArray).countDocuments().exec())
    const features = new APIFeatures(Track.find().where('_id').in(idArray), req.query).paginate().limitFieldsTracks()
    results.items = await features.query

    res.status(200).json({
    status: 'success',
    data: {
        results
    }
    })
  
})


// exports.getSearchedForTracks = catchAsync(async (req, res, next) => {
//     let idArray = await searchService(req.query.q)

//     if (idArray.length==0) {
//       return next(new AppError('No tracks found', 404))
//     }

//     const features = new APIFeatures(Track.find().where('_id').in(idArray), req.query).limitFieldsTracks() 
//     const tracks = await features.query

   
//     res.status(200).json({
//       status: 'success',
//       data: {
//         tracks
//       }
//     })
//   })
