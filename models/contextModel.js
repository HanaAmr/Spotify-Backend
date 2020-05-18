/** MongoDB Model for the context object.
 * @module models/context
 * @requires mongoose
 */

const mongoose = require('mongoose')

/**
 * Context schema
 * @alias module:models/context
 * @type {object}
 * @property {String} href href of the playlist
 * @property {String} externalUrls externalUrls of the playlist
 * @property {String} type type of the context, album/artist/playlist
 * @property {String} id spotify id of the context (album/artist/playlist)
 * @property {String} images images of the playlist
 * @property {Number} followersCount The number of followers for this context
 * @property {String} playHistoryId The id of the playHistory model that has this context
 * @const
 */
const contextSchema = new mongoose.Schema({
  externalUrls: [String],
  href: {
    type: String,
    required: [true, 'Context must have api endpoint to details of the track']
  },
  type: {
    type: String,
    required: [true, 'Context must know the type of object, either artist, playlist or album'],
    enum: ['artist', 'playlist', 'album']
  },
  id: {
    type: String,
    requried: [true, 'Context must have a Spotify id']
  },
  name: String,
  images: {
    type: Array
  },
  followersCount: Number,
  playHistoryId: String // Not required, only if context was created for playHistoryModel to be able to delete it
})

const Context = mongoose.model('Context', contextSchema)

module.exports = Context
