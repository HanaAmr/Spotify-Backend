/** MongoDB Model for the music player object.
 * @requires mongoose
 */
const mongoose = require('mongoose')

/**
 * Player object schema
 * @memberof module:models~
 * @class player
 * @classdesc The player object that contains details of the music player of the user.
 */
 const playerSchema = new mongoose.Schema({
     userId: {
         type: String,
         required: [true, 'A player must have a userId to belong to'],
         unique: true
     },
     context: {
         type: mongoose.Schema.ObjectId,
         ref: 'Context',
     },
     queueTracksUris: [{
         type: String
     }],
     queueOffset: Number
 })

 /**
* Populating the player object
* @function preFindPopulate
* @memberof module:models~player
* @this module:models~player
* @param {Function} next - The next function to be called. 
*/
playerSchema.pre(/^find/, function (next) {
    this.populate('context')
    next()
})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player