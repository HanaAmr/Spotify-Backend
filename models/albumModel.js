/** Express controller providing album model
 * @module models
 * @requires express
 */
 
/**
 * Album model 
 * @type {object}
 * @const
 * @namespace albumModel
 */

/**
 * express module
 * @const
 */
const mongoose = require('mongoose')

/**
 * Album schema
 * @memberof module:models~albumModel
 * @type {object}
 * @property {String} name Name of the album
 * @property {String} href href of the album
 * @property {String} images images of the album
 * @property {String} albumType albumType of the album
 * @property {String} externalUrls externalUrls of the album
 * @property {String} type type of the album
 * @property {String} uri uri of the album
 * @property {String} genre genre of the album
 * @property {String} label label of the album
 * @property {Number} popularity popularity of the album
 * @property {String} copyrights copyrights of the album
 * @property {Date} releaseDate releaseDate of the album
 * @property {object} artists artists of the album
 * @property {Number} totalTracks totalTracks of the album
 * @const
 */
const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,'An album must have a name'],
    unique: true
  },
  href:{
    type: String,
    default: `${process.env.API_URL}/albums/`
  },
  image: {
    type: String,
    required: [true, 'An album must have an image']
  },
  albumType:{
    type: String,
    required: [true, 'An Album must have a type']
  },
  externalUrls: {
    description: 'an external URL object  Known external URLs for this album',
    type: [String]
  },
  type: {
    description: 'The object type  “album”',
    type: String
  },
  uri: {
    type: String,
    description: 'The Spotify URI for the album.',
    default: 'spotify:albums:'
  },
  genre: {
    description: 'An array of strings. A list of the genres used to classify the album.',
    type: [String],
    required: [true,'An album must have at least one genre']
  },
  label: {
    description: 'The label for the album.',
    type: String
  },
  popularity: {
    description: 'The popularity of the album. The value will be equal to the sum of the likes of the album’s individual tracks.',
    type: Number,
	  default:0
  },
  copyrights: {
    description: 'Array of copyrights objects. The copyright statements of the album.',
    type: [String]
  },
  releaseDate: {
    description: 'The date the album was first released, for example 1981. Depending on the precision, it might be shown as 1981-12 or 1981-12-15.',
    type: Date,
    default: Date.now()
  },
  artist: 
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
,
  totalTracks: {
    description: 'The total number of tracks inside the album',
    type: Number ,
    default:0 
  }
})

// /**
// * Populating the artist object
// * @function
// * @memberof module:models/albumModel
// * @inner
// * @param {string} find - populate the database before any find function
// */
// albumSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'artists',
//     select: '_id name uri href externalUrls images type followers userStats userArtist'   // user public data

//   })

//   next()
// })

const Album = mongoose.model('Album', albumSchema)

module.exports = Album
