/** MongoDB Model for the play history object.
 * @module models/playHistory
 * @requires mongoose
 */
const mongoose = require('mongoose')

/**
 * Play History schema
 * @alias module:models/playHistory
 * @type {object}
 * @property {String} userId The id of the user that this play history belongs to
 * @property {object} context The context that belongs to this play history object
 * @property {Date} playedAt The time the track belonging to play history was played
 * @property {object} track The track that the user has listened to in this play history
 * @const
 */
const playHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'Play history must belong to a certain user']
  },
  context: {
    type: mongoose.Schema.ObjectId,
    ref: 'Context',
    required: [true, 'Play history must know the context the track was played in.']
  },
  playedAt: {
    type: Date,
    required: [true, 'Play history object must have the time the track was played at.']
  },
  track: {
    type: mongoose.Schema.ObjectId,
    ref: 'Track',
    required: [true, 'Play history object must contain the track played!']
  }
})

/**
* Populating the play history object
* @function preFindPopulate
* @memberof module:models~playHistory
* @this module:models~playHistory
* @param {Function} next - The next function to be called.
*/
playHistorySchema.pre(/^find/, function (next) {
  this.populate('context', '-__v -_id -playHistoryId')
  this.populate('track', '-_id -__v -audioFilePath')
  next()
})

/**
* Deleting the context tied to the play history model before deleting play history object.
* @function deletePlayHistoryContext
* @memberof module:models~playHistory
* @this module:models~playHistory
* @param {Document} doc - The document that is being deleted.
*/
playHistorySchema.post('findOneAndDelete', function (doc) {
  require('./contextModel').deleteMany({ playHistoryId: doc._id }).exec()
})

const PlayHistory = mongoose.model('PlayHistory', playHistorySchema)

module.exports = PlayHistory
