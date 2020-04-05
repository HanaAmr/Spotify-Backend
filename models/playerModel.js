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



const Player = mongoose.model('Player', playerSchema)

module.exports = Player