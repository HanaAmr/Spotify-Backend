/** Express controller providing playlist model
 * @module controllers/playlist
 * @requires express
 */

/**
 * express module
 * @const
 */
const mongoose = require('mongoose')

/**
 * Playlist schema
 * @type {object}
 * @const
 */
const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name of the playlist'],
    unique: true
  },
  collaborative: {
    type: Boolean,
    description: 'Returns true if context is not search and the owner allows other users to modify the playlist. Otherwise returns false.'
  },
  description: {
    type: String,
    description: 'The playlist description.Returns the names of the artists in this playlist'
  },
  images: [String],
  type: {
    description: 'The object type  “playlist”',
    type: String
  },
  uri: {
    type: String,
    required: true,
    description: 'The Spotify URI for the playlist.'
  },
  href: {
    type: String,
    required: true,
    description: 'A link to the Web API endpoint providing full details of the playlist.'
  },
  public: {
    type: Boolean,
    description: 'The playlist’s public/private status true the playlist is public, false the playlist is private, null the playlist status is not relevant.'
  },
  snapshot_id: {
    type: String,
    description: 'The version identifier for the current playlist. Can be supplied in other requests to target a specific playlist version.'
  },
  external_urls: {
    description: 'an external URL object  Known external URLs for this playlist.',
    type: [String]
  },
  category: {
    description: 'The id of the category this playlist belongs to',
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  },
  owner: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  tracks: [
    {
      href: String
    },
    {
      total: Number
    }
  ],
  trackObjects: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Track'
    }
  ],
  noOfFollowers: {
    description: 'The number of followers to this playlist',
    type: Number
  },
  popularity: {
    description: 'The number of likes to this playlist',
    type: Number
  }

})

// playlistSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'trackObjects'
//   })
//   // this.populate({
//   //   path: 'owner',
//   // })

//   next()
// })

const Playlist = mongoose.model('Playlist', playlistSchema)

module.exports = Playlist
