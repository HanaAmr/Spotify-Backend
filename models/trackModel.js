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
  image: {
    type: String,
    //required: [true, "A track must have an image"]
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
  previewUrl: {
    type: String,
    description: 'A link to 30 second preview of the track.'
    //required: [true, "A track must have a preview URL"]
  },
  album: {
    type: mongoose.Schema.ObjectId,
    ref: 'album'
  },
  artists: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'user'
    }
  ]
})

/**
* Populating the album object
* @function
* @memberof module:models/trackModel
* @inner
* @param {string} find - populate the documents before any find function
*/
trackSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'album'
  })
    this.populate({    
     path: 'artists',
    })

  next()
})

const Track = mongoose.model('Track', trackSchema)

module.exports = Track
