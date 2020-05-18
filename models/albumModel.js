/**
 * Models module.
 * @module models/album
 * @requires mongoose
 */


const mongoose = require('mongoose')

/**
 * Album schema
 *  @alias module:models/album
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
 * @property {Array} tracks tracks of the album
 * @const
 */
const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An album must have a name'],
    unique: true
  },
  href: {
    type: String,
    default: `${process.env.API_URL}/albums/`
  },
  image: {
    type: String,
    required: [true, 'An album must have an image'],
    default: 'http://138.91.114.14/api/public/imgs/albums/default.jpg'
  },
  albumType: {
    type: String,
    required: [true, 'An Album must have a type']
  },
  externalUrls: {
    description: 'an external URL object  Known external URLs for this album',
    type: [String]
  },
  type: {
    description: 'The object type  “album”',
    type: String,
    default: 'album'
  },
  uri: {
    type: String,
    description: 'The Spotify URI for the album.',
    default: 'spotify:albums:'
  },
  genre: {
    description: 'An array of strings. A list of the genres used to classify the album.',
    type: [String],
    required: [true, 'An album must have at least one genre']
  },
  label: {
    description: 'The label for the album.',
    type: String,
    default: ' '
  },
  popularity: {
    description: 'The popularity of the album. The value will be equal to the sum of the likes of the album’s individual tracks.',
    type: Number,
	  default: 0
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
  artists:
    [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }],
  totalTracks: {
    description: 'The total number of tracks inside the album',
    type: Number,
    default: 0
  },
  trackObjects: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Track'

    }
  ]
})

const Album = mongoose.model('Album', albumSchema)

module.exports = Album
