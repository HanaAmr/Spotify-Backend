/** Express service for music player
 * @module services/player
 * @requires express
 */

/**
 * express module
 * Player model from the database
 * @const
 */
const User = require('../models/playerModel')

/* express module
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
 * Player model from the database
 * @const
 */
const Player = require('../models/playerModel')

/**
 * express module
 * user services object
 * @const
 */
const userServices = require('./userService')
const userService = new userServices()

/**
 * express module
 * error object
 * @const
 */
const AppError = require('../utils/appError')

class playerService {
    // Constructor with dependency injection
    constructor (userService) {
        this.userService = userService
    }

/**
* Checking if track requested can be played by user or not
* @function
* @memberof module:models/playerModel
* @inner
* @param {Request} req req - The request sent.
*/
async validateTrack (authToken) {
    const userId = await userService.getUserId(authToken)
    const userRole = await userService.getUserRole(authToken)
    if(userRole === 'user') {
        return false //TODO: Instead of returning false, compare with the current queue for this user.
    }
    return true
    
}

/**
 * //TODO:
* Generates the context for the song playing.
* @function
* @memberof module:models/playerModel
* @inner
* @param {userId} - The user id.
*/
async generateContext (userId) {

}


/**
* Gets the context for the passed user.
* @function
* @memberof module:models/playerModel
* @inner
* @param {authToken} - The authorization token.
*/
async getContext (authToken) {
    const userId = await userService.getUserId(authToken)
    const context = await Player.find({userId : userId}).select('context')
    return context
}

/**
* Checking if the user with this token has reached the maximum number of recently played items
* @function
* @memberof module:models/playerModel
* @inner
* @param {Request} req req - The request sent.
*/
async deleteOneRecentlyPlayedIfFull (authToken) {
    const userId = await userService.getUserId(authToken)
    const count = await PlayHistory.countDocuments({ userId: userId })
    if (count >= parseInt(process.env.PLAY_HISTORY_MAX_COUNT, 10)) { // If we reached the limit of playHistory for this user
    const oldestPlayHistory = await PlayHistory
      .find()
      .where('userId').equals(userId)
      .sort('playedAt')
      .limit(1)
    await PlayHistory.findByIdAndDelete(oldestPlayHistory[0]._id)
  }  
}
    
}

module.exports = playerService
