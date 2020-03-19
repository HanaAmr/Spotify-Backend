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
    required: [true, 'The name of the track'],
    unique: true
  },
  image: String,
  type: {
    description: 'The object type  “track” ',
    type: String
  },
  uri: {
    type: String,
    required: true,
    description: 'The Spotify URI for the track.'
  },
  href: {
    type: String,
    required: true,
    description: 'A link to the Web API endpoint providing full details of the track.'
  },
  external_urls: {
    description: 'an external URL object  Known external URLs for this track.',
    type: String
  },
  external_ID: {
    description: 'Known external IDs for the track.',
    type: String
  },
  trackNumber: {
    type: Number,
    description: 'The number of the track in the album.'
  },
  isLocal: {
    type: Boolean,
    description: 'A boolean that describes if the track is local or not.'
  },
  durationMs: {
    type: Number,
    description: 'The duration of the track in milliseconds.'
  },
  popularity: {
    type: Number,
    description: 'The number of likes of the track.'
  },
  previewUrl: {
    type: String,
    description: 'A link to 30 second preview of the track.'
  },
  album: {
    type: mongoose.Schema.ObjectId,
    ref: 'Album'
  },
  artist: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Artist'
    }
  ]
})

/**
* Populating the album object
* @function
* @memberof module:models/trackModel
* @inner
* @param {string} find - populate the database before any find function
*/
trackSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'album'
  })
  // this.populate({
  //   path: 'artists',
  // })

  next()
})

const Track = mongoose.model('Track', trackSchema)

module.exports = Track
