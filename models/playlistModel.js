/**
 * Models module.
 * @module models/playlist
 * @requires mongoose
 */

const mongoose = require('mongoose')

/**
 * Playlist schema
 *  @alias module:models/playlist
 * @type {object}
 * @property {String} name Name of the playlist
 * @property {String} href href of the playlist
 * @property {String} images images of the playlist
 * @property {Boolean} collaborative Is the playlist collaborative
 * @property {String} externalUrls externalUrls of the playlist
 * @property {String} type type of the playlist
 * @property {String} uri uri of the playlist
 * @property {String} description description of the playlist
 * @property {String} snapshot_id snapshot_id of the playlist
 * @property {Boolean} public Is the playlist public
 * @property {Number} popularity popularity of the playlist
 * @property {Array} tracks tracks of the playlist
 * @property {Date}  createdAt createdAt of the playlist
 * @property {object} owner owner of the playlist
 * @property {object} category category of the playlist
 * @property {Number} noOfFollowers totalTracks of the playlist
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
    description: 'Returns true if context is not search and the owner allows other users to modify the playlist. Otherwise returns false.',
    default: false
  },
  description: {
    type: String,
    description: 'The playlist description.Returns the names of the artists in this playlist',
    default: ''
  },
  images: {
    type: [String],
    default: `${process.env.API_URL}/public/imgs/playlists/default.jpg`
  },
  type: {
    description: 'The object type  “playlist”',
    type: String,
    default: 'playlist'
  },
  uri: {
    type: String,
    // required: true,
    description: 'The Spotify URI for the playlist.',
    default: ''
  },
  href: {
    type: String,
    // required: true,
    description: 'A link to the Web API endpoint providing full details of the playlist.',
    default: ''
  },
  public: {
    type: Boolean,
    description: 'The playlist’s public/private status true the playlist is public, false the playlist is private, null the playlist status is not relevant.',
    default: true
  },
  snapshotId: {
    type: String,
    description: 'The version identifier for the current playlist. Can be supplied in other requests to target a specific playlist version.',
    default: ''
  },
  externalUrls: {
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
      ref: 'User',
      required: true
    }
  ],
  tracks: {
    type: {
      href: String,
      total: Number
    }
  },
  trackObjects: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Track'
  }],
  noOfFollowers: {
    description: 'The number of followers to this playlist',
    type: Number,
    default: 0
  },
  popularity: {
    description: 'The number of likes to this playlist',
    type: Number,
    default: 0
  },
  createdAt: {
    description: 'The date the playlist was created',
    type: Date,
    default: Date.now()
  }

})

const Playlist = mongoose.model('Playlist', playlistSchema)

module.exports = Playlist
