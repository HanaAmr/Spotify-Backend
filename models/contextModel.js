/** Express controller providing context model for the track.
 * @module controllers/player
 * @requires express
 */

/**
 * express module
 * @const
 */
const mongoose = require('mongoose')

/**
 * Context schema
 * @type {object}
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
         enum: ['artist', 'playlist','album']
     },
     uri: {
         type: String,
         requried: [true, 'Context must have a URI']
     },
     name: String,
     images: {
         type: Array
     },
     followersCount: Number,
     playHistoryId: String //Not required, only if context was created for playHistoryModel to be able to delete it
 })


const Context = mongoose.model('Context', contextSchema)

 module.exports = Context