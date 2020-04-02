/** Express controller providing track model
 * @module controllers/track
 * @requires express
 */

/**
 * express module
 * @const
 */
const mongoose = require('mongoose')

/**
 * Track schema
 * @type {object}
 * @const
 */

const trackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A track must have an album"],
    unique: true
  },
  type: String,
  uri:{
    type: String,
    //required: [true, "A track must have a spotify URI"]
  },
  href:{
      type: String,
      required: [true, "A track must have a refernce"]
  },
  externalUrls:{
      type: [String]
  },
  external_ID: {
    description: 'Known external IDs for the track.',
    type: String
  },
  trackNumber: {
    type: Number,
    required: [true, "A track must be ordered in the album (track Number)"]
  },
  isLocal: {
    type: Boolean,
    required: [true, "A track must have an isLocal bit"]
  },
  durationMs: {
    type: Number,
    required: [true, "A track must contain its duration"]
  },
  popularity: {
    type: Number,
	  default:0
  },
  album: {
    type: mongoose.Schema.ObjectId,
    ref: 'Album',
  },
  artists: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  audioFilePath: {
    type: String,
    required: [true, 'A track must have a path for its audio file to play.']
  }
})

/**
* Populating the album object
* @function
* @memberof module:models/trackModel
* @inner
* @param {string} find - populate the documents before any find function
*/
// trackSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'album'
//   })
//   this.populate({
//     path: 'artists',
//     select: '_id name uri href externalUrls images type followers userStats userArtist'   // user public data
//   })

//   next()
// })

// trackSchema.pre(/^find/, function (next) {
//   this.updateMany( {}, { $rename: { "_id": "id" } } )
//   next()
// })

const Track = mongoose.model('Track', trackSchema)

module.exports = Track
