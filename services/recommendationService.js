/**
 * For getting recommended tracks for a playlist
 * @module services/recommendation
 * @requires express
 */

/**
 * Playlist model from the database
 * @const
 */
const Playlist = require('./../models/playlistModel')

/**
 * Track model from the database
 * @const
 */
const Track = require('./../models/trackModel')

/**
* For getting recommended tracks for a playlist
* @function
* @memberof module:services/recommendationService
* @param {playlistId} - The ID of the playlist
* @return {tracks} The results object containing a list of tracks to be excluded, and the new limit of tracks, and a random page chosen.
*/
module.exports = async function (playlistId) {
  let query = Playlist.findById(playlistId)
  query = await query.select('trackObjects')

  const tracks = {}
  tracks.excludeTracks = await Track.find().where('_id').in(query.trackObjects).select('_id')

  tracks.limit = 3
  const pages = Math.ceil((await Track.countDocuments() - tracks.excludeTracks.length) / 3)
  tracks.page = Math.floor((Math.random() * pages) + 1)

  return tracks
}
