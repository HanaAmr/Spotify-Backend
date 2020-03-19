/** Express controller providing album model
 * @module controllers/album
 * @requires express
 */

/**
 * express module
 * @const
 */
const mongoose = require('mongoose')

/**
 * Album schema
 * @type {object}
 * @const
 */
const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name of the category'],
    unique: true
  },
  href: {
    type: String,
    required: [true, ' A link to the Web API endpoint returning full details of the category.']
  },
  images: {
    type: [String],
    required: [true, 'An array of images objects. The cover art for the album in various sizes, widest first.']
  },
  albumType: {
    description: 'The type of the album, one of "album" , "single" , or "compilation".',
    type: String
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
    required: true,
    description: 'The Spotify URI for the album.'
  },
  genre: {
    description: 'An array of strings. A list of the genres used to classify the album. For example, "Prog Rock" , "Post-Grunge". (If not yet classified, the array is empty.)',
    type: [String]
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
  artsits: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Artist'
    }
  ],
  total_tracks: {
    description: 'The total number of tracks inside the album',
    type: Number
  }
})

// /**
// * Populating the artist object
// * @function
// * @memberof module:models/albumModel
// * @inner
// * @param {string} find - populate the database before any find function
// */
// albumSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'artists',
//   })

//   next()
// })

const Album = mongoose.model('Album', albumSchema)

module.exports = Album
