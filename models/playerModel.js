/** MongoDB Model for the music player object.
 * @module models/player
 * @requires mongoose
 */
const mongoose = require('mongoose')

/**
 * Player schema
 * @alias module:models/player
 * @type {object}
 * @property {String} userId The id of the user that this player belongs to
 * @property {object} Context The context of this player that keeps track of user activity
 * @property {String} queueTracksIds The list of tracks ids in the queue for free user
 * @property {Number} queueOffset The offset of the queue, i.e. which track should be played
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
    ref: 'Context'
  },
  queueTracksIds: [{
    type: String
  }],
  queueOffset: {type: Number, default: 0},
  skipsMade: {type: Number, default: 0},
  skipsRefreshAt: Date,
  adsPlayed: {type: Number, default: 0}
})

/**
* Populating the player object
* @function preFindPopulate
* @memberof module:models~player
* @this module:models~player
* @param {Function} next - The next function to be called.
*/
playerSchema.pre(/^find/, function (next) {
  this.populate('context')
  next()
})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player
