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
    context: {
        type: mongoose.Schema.ObjectId,
        ref: 'context',
        required: [true, 'Play history must know the context the track was played in.']
    },
    playedAt: {
        type: Date,
        required: [true, 'Play history object must have the time the track was played at.']
    },
    track: {
        type: mongoose.Schema.ObjectId,
        ref: 'track',
        required: [true, 'Play history object must contain the track played!']
    }
})

/**
* Populating the track, context object
* @function
* @memberof module:models/playHistoryModel
* @inner
* @param {string} find - populate the documents before any find function
*/
playHistorySchema.pre(/^find/, function (next) {
    this.populate({
      path: 'context'
    })
    this.populate({    
       path: 'track',
    })
    next()
  })

  const PlayHistory = mongoose.model('PlayHistory', playHistorySchema)

  module.exports = PlayHistory