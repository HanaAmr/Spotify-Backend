/** Express controller providing playHistory model
 * @module controllers/player
 * @requires express
 */

/**
 * express module
 * @const
 */
const mongoose = require('mongoose')

/**
 * playHistory schema
 * @type {object}
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
* Populating the playHistory
* @function
* @memberof module:models/playHistoryModel
* @inner
* @param {string} find - populate the documents before any find function
*/
playHistorySchema.pre(/^find/, function (next) {
  this.populate('context', '-__v -_id -playHistoryId')
  this.populate('track', '-_id -__v')
  next()
})

/**
* Before deleting the playHistoryModel, delete the context it refrenced.
* @function
* @memberof module:models/playHistoryModel
* @inner
*/
playHistorySchema.post('findOneAndDelete', function (doc) {
  require('./contextModel').deleteMany({ playHistoryId: doc._id }).exec()
})

const PlayHistory = mongoose.model('PlayHistory', playHistorySchema)

module.exports = PlayHistory
