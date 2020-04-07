/**
 * Models module.
 * @module models/track
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

/**
 * Track schema
 *  @alias module:models/track
 * @type {object}
 * @property {String} name Name of the track
 * @property {String} href href of the track
 * @property {String} externalUrls externalUrls of the track
 * @property {String} external_ID external_ID of the track
 * @property {String} type type of the track
 * @property {String} uri uri of the track
 * @property {Number} popularity popularity of the track
 * @property {object} album album of the track
 * @property {object} artists artists of the track
 * @property {String} audioFilePath audioFilePath of the track
 * @property {Number} durationMs durationMs of the track
 * @property {Number} trackNumber trackNumber in the album
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
    default: 'spotify:tracks:'
  },
  href:{
      type: String,
      default: `${process.env.API_URL}/tracks/`
  },
  externalUrls:{
      type: [String]
  },
  externalId: {
    description: 'Known external IDs for the track.',
    type: String
  },
  trackNumber: {
    type: Number,
    required: [true, "A track must be ordered in the album (track Number)"]
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
    //required: [true, 'A track must have a path for its audio file to play.']
  }
})

// /**
// * Populating the album object
// * @function
// * @memberof module:models/trackModel
// * @inner
// * @param {string} find - populate the documents before any find function
// */
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
