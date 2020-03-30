/**
 * PlayerController module.
 * @module playerController
 * @requires express
 */

/**
 * Player controller to call when routing.
 * @type {object}
 * @const
 * @namespace playerController
 */

 /**
 * express module
 * Context model from the database
 * @const
 */
const Context = require('../models/contextModel')
/**
 * express module
 * Play History model from the database
 * @const
 */
const PlayHistory = require('../models/playHistoryModel')
/**
 * express module
 * Track model from the database
 * @const
 */
const Track = require('../models/trackModel')

/**
 * express module
 * Async functions
 * @const
 */
const async = require('async')

/**
 * express module
 * catchAsync utils file
 * @const
 */
const catchAsync = require('../utils/catchAsync')

/**
 * express module
 * APIFeatures utils file
 * @const
 */
const APIFeatures = require('../utils/apiFeatures')


/**
 * express module
 * Authroization controller
 * @const
 */
const authController = require('../controllers/authController')


/**
 * express module
 * error object
 * @const
 */
const AppError = require('../utils/appError')

/**
 * A function that is used to add a track to the recently played list
 * @memberof module:controllers/player~playerController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
exports.addToRecentlyPlayed = catchAsync(async function (req, res, next) {
    const userId = await authController.getUserId(req)

    //Check if we reached the limit for this user
    const count = await PlayHistory.countDocuments({'userId':userId})
    if(count >= parseInt(process.env.PLAY_HISTORY_MAX_COUNT,10)){ //If we reached the limit of playHistory for this user
        const oldestPlayHistory = await PlayHistory
        .find()
        .where('userId').equals(userId)
        .sort('playedAt')
        .limit(1)
        //Delete the context object first
        await Context.deleteOne({_id: {$in: oldestPlayHistory[0]    .context}})
        await PlayHistory.deleteOne({_id: {$in: oldestPlayHistory}}) //Remove the oldest play history object for this user
    }

    //TODO: Instead of getting the context from the request, we should have it saved 
    // when the user started playing
    const newContext = await Context.create(req.body.context)
    const track = await Track.find().where('uri').equals(req.body.trackUri).select('_id')
    if(!track){
        return next(new AppError('No track with this uri was found!',404))
    }
    const newPlayHistory = new PlayHistory({
        'userId':userId,
        'context': newContext._id,
        'playedAt': Date.now(),
        'track': track[0]._id
    })
    await newPlayHistory.save()
    
    res.status(204).send()
})


/**
 * A function that is used to get the recently played list
 * @memberof module:controllers/player~playerController
 * @param {Request}  - The function takes the request as a parameter to access its body.
 * @param {Respond} - The respond sent
 * @param {next} - The next function in the middleware
 */
exports.getRecentlyPlayed = catchAsync(async function (req, res, next) {
    const userId = await authController.getUserId(req)
    const features = new APIFeatures(PlayHistory.find().where('userId').equals(userId).select('-userId -_id'), req.query).limitFields().paginate()
    const items = await features.query
    res.status(200).json({
        status: 'success', 
        data: {
        items
        }
    })
})


