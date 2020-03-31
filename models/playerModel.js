/** Express controller providing player model.
 * @module controllers/player
 * @requires express
 */

/**
 * express module
 * @const
 */
const mongoose = require('mongoose')


/**
 * Authorization controller
 * express module
 * @const
 */
const authController = require('../controllers/authController')

/**
 * Player schema
 * @type {object}
 * @const
 */

 const playerSchema = new mongoose.Schema({
     userId: {
         type: String,
         required: [true, 'A player must have a userId to belong to'],
         unique: true
     },
     context: {
         type: mongoose.Schema.ObjectId,
         ref: 'Context',
     },
     queueTracksUris: [{
         type: String
     }],
     queueOffset: Number
 })

 /**
* Populating the player object
* @function
* @memberof module:models/playerModel
* @inner
* @param {string} find - populate the documents before any find function
*/
playerSchema.pre(/^find/, function (next) {
    this.populate('context')
    next()
  })

  /**
* Populating the player object
* @function
* @memberof module:models/playerModel
* @inner
* @param {string} find - populate the documents before save function
*/
playerSchema.pre('save', function (next) {
    this.populate('context')
    next()
  })

/**
* Checking if track requested can be played by user or not
* @function
* @memberof module:models/playerModel
* @inner
* @param {Request} req req - The request sent.
*/
playerSchema.statics.validateTrack = async function(req) {
    const userId = await authController.getUserId(req)
    const userRole = await authController.getUserRole(req)
    if(userRole === 'user') {
        return false //TODO: Instead of returning false, compare with the current queue for this user.
    }
    return true
    
}

const Player = mongoose.model('Player', playerSchema)

module.exports = Player