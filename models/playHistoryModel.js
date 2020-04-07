/** MongoDB Model for the play history object.
 * @requires mongoose
 */

const mongoose = require('mongoose')

/**
 * Play History object schema
 * @memberof module:models~
 * @class playHistory
 * @classdesc The Play History object that contains details of a track playback that is used in recently played list.
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
