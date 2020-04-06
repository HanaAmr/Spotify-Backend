/** Express service for music player
 * @module services/player
 * @requires express
 */

/**
 * User model from the database
 * @const
 */
const User = require('../models/userModel')

/* 
* Context model from the database
* @const
*/
const Context = require('../models/contextModel')

/**
 * Play History model from the database
 * @const
 */
const PlayHistory = require('../models/playHistoryModel')

/*
* Playlist model from the database
* @const
*/
const Playlist = require('../models/playlistModel')

/*
* Album model from the database
* @const
*/
const Album = require('../models/albumModel')

/**
 * 
 * Player model from the database
 * @const
 */
const Player = require('../models/playerModel')

/**
 * User services class
 * @const
 */
const userServices = require('./userService')

const userService = new userServices()

/**
 * Class reprensenting the player services needed to handle the music player
 */
class playerService {
    // Constructor with dependency injection
    /**
    * Constructs the player service
    * @param {*} userService
    */
    constructor(userService) {
        this.userService = userService
    }

    /**
    * Checks if track requested can be played by user or not
    * @function
    * @param {String} authToken - The authorization token of the user.
    */
    async validateTrack(authToken) {
        const userId = await userService.getUserId(authToken)
        const userRole = await userService.getUserRole(authToken)
        return true //TODO: Instead of returning true, compare with the current queue for this user if was free member.
    }

    /**
     * 
    * Generates the context for the song playing at the moment of sending the request.
    * @function
    * @param {String} uri - The uri of played conext.
    * @param {String} type - The type of played context.
    */
    async generateContext(uri, type) {
        const newContext = new Context()
        newContext.uri = uri
        newContext.type = type
        if (type == 'playlist') {
            const contextPlaylist = await Playlist.findOne({ uri: uri })
            newContext.externalUrls = contextPlaylist.external_urls
            newContext.href = contextPlaylist.href
            newContext.name = contextPlaylist.name
            newContext.images = contextPlaylist.images
            newContext.followersCount = contextPlaylist.popularity
        }
        else if (type == 'album') {
            const contextAlbum = await Album.findOne({ uri: uri })
            newContext.externalUrls = contextAlbum.externalUrls
            newContext.href = contextAlbum.href
            newContext.name = contextAlbum.name
            newContext.images = contextAlbum.images
            newContext.followersCount = contextAlbum.popularity
        }
        else if (type == 'artist') {
            const usr = await User.find({})
            const contextArtist = await User.findOne({'uri': uri })
            newContext.externalUrls = contextArtist.externalUrls
            newContext.href = contextArtist.href
            newContext.name = contextArtist.name
            newContext.images = contextArtist.images
            newContext.followersCount = contextArtist.followers.length
        }
        return newContext
    }


    /**
    * Gets the context for the passed user.
    * @function
    * @inner
    * @param {String} authToken - The authorization token.
    */
    async getContext(authToken) {
        const userId = await userService.getUserId(authToken)
        const context = await Player.find({ userId: userId }).select('context')
        return context
    }

    /**
    * Checks if the user with this token has reached the maximum number of recently played items and if so deletes one recently played item.
    * @function
    * @param {String} authToken  - The authorization token of the user.
    */
    async deleteOneRecentlyPlayedIfFull(authToken) {
        const userId = await userService.getUserId(authToken)
        const count = await PlayHistory.countDocuments({ userId: userId })
        if (count >= parseInt(process.env.PLAY_HISTORY_MAX_COUNT, 10)) { // If we reached the limit of playHistory for this user
            const oldestPlayHistory = await PlayHistory
                .find()
                .where('userId').equals(userId)
                .sort('playedAt')
                .limit(1)
            await PlayHistory.findByIdAndDelete(oldestPlayHistory[0]._id)
        }
    }

}

module.exports = playerService
