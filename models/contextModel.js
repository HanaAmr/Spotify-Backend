/** MongoDB Model for the context object.
 * @module models
 * @requires mongoose
 */

const mongoose = require('mongoose')

/**
 * Context object schema
 * @class context
 * @classdesc The context object that describes how did a user listen to a track, as a part of a playlist, or album or artist.
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