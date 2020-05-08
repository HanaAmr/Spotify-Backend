// /** Express service for music player
//  * @module services/player
//  * @requires express
//  */

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
 *
 * Track model from the database
 * @const
 */
const Track = require('../models/trackModel')

/**
 *
 * App error util
 * @const
 */
const AppError = require('../utils/appError')

/**
 * User services class
 * @const
 */
const UserServices = require('./userService')

const userService = new UserServices()

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
    * Checks if track requested can be played by user or not.
    * @function
    * @param {String} authToken - The authorization token of the user.
    * @param {String} trackId - The id of the track to be played
    * @returns {Number} 1 if can be played, -1 if can't be played because ad must be played, -2 if song requested isn't the one in the queue.
    */
  async validateTrack(authToken, trackId) {
    const userId = await userService.getUserId(authToken)
    const userRole = await userService.getUserRole(authToken)
    if (userRole != 'user') return 1
    const userPlayer = await Player.findOne({ userId: userId })
    //If user should play one track
    if (userPlayer.queueOffset / process.env.ADS_COUNTER > userPlayer.adsPlayed)
      return -1
    //If track requested isn't the one in order in the shuffled list
    if (userPlayer.queueTracksIds[userPlayer.queueOffset] != trackId)
      return -2
    await this.finishTrack(userId, 1)
    userPlayer.queueOffset = (userPlayer.queueOffset + 1) % (userPlayer.queueTracksIds.length)
    await userPlayer.save()
    return 1
  }

  /**
     *
    * Generates the context for the song playing at the moment of sending the request.
    * Gets the list of track Ids from context and shuffles them
    * @function
    * @param {String} id - The id of played conext.
    * @param {String} type - The type of played context.
    * @param {String} userId - The Id of the user.
    * @returns {Array} The shuffled array of tracks ids
    */
  async generateContext(id, type, userId) {
    const user = await User.findById(userId)
    //Create the queue of tracks
    let queueTracksIds
    //Create the context for the user and update its id and type
    const newContext = new Context()
    newContext.id = id
    newContext.type = type
    //Update the context and queueTracksIds based on type of context
    if (type === 'playlist') {
      const contextPlaylist = await Playlist.findOne({ _id: id })
      if (!contextPlaylist) return null
      newContext.externalUrls = contextPlaylist.external_urls
      newContext.href = contextPlaylist.href
      newContext.name = contextPlaylist.name
      newContext.images = contextPlaylist.images
      newContext.followersCount = contextPlaylist.popularity
      queueTracksIds = await contextPlaylist.trackObjects
    } else if (type === 'album') {
      const contextAlbum = await Album.findOne({ _id: id })
      if (!contextAlbum) return null
      newContext.externalUrls = contextAlbum.externalUrls
      newContext.href = contextAlbum.href
      newContext.name = contextAlbum.name
      newContext.images = contextAlbum.images
      newContext.followersCount = contextAlbum.popularity
      queueTracksIds = await contextAlbum.trackObjects
    } else if (type === 'artist') {
      const contextArtist = await User.findOne({ _id: id })
      if (contextArtist == null) return null
      newContext.externalUrls = contextArtist.externalUrls
      newContext.href = contextArtist.href
      newContext.name = contextArtist.name
      newContext.images = contextArtist.images
      newContext.followersCount = contextArtist.followers.length
      queueTracksIds = await contextArtist.trackObjects
    }
    //Get user player and update the queue with shuffled list and the userPlayer context
    const userPlayer = await Player.findOne({ 'userId': userId })
    userPlayer.context = newContext
    userPlayer.queueTracksIds = queueTracksIds
    userPlayer.queueOffset = 0
    userPlayer.adsPlayed = 0
    await userPlayer.save()
    const shuffledList = await this.shufflePlayerQueue(userId)
    userPlayer.queueTracksIds = shuffledList
    //Update the currently played track for the context
    const currTrack = await Track.findOne({ '_id': userPlayer.queueTracksIds[userPlayer.queueOffset] })
    newContext.href = currTrack.href
    await newContext.save()
    await userPlayer.save()
    await user.save()
    return shuffledList
  }

  /**
    * Gets the context for the passed user.
    * @function
    * @inner
    * @param {String} userId - The ID of the user.
    */
  async getContext(userId) {
    const userPlayer = await Player.findOne({ userId: userId })
    const userContext = userPlayer.context
    return userContext
  }

  /**
    * Checks if the user with this token has reached the maximum number of recently played items and if so deletes one recently played item.
    * @function
    * @param {String} userId  - The ID of the user.
    */
  async deleteOneRecentlyPlayedIfFull(userId) {
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

  /**
  * Shuffles the queue of songs for the player.
  * @function
  * @param {String} userId  - The ID of the user.
  * @returns {Array} The shuffled array of tracks
  */
  async shufflePlayerQueue(userId) {
    const userPlayer = await Player.findOne({ 'userId': userId })
    const userQueue = await userPlayer.queueTracksIds
    //Using Fisher-Yates shuffling algorithm, shuffle the queue.
    let i, j, x
    for (i = userQueue.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      x = userQueue[i]
      userQueue[i] = userQueue[j]
      userQueue[j] = x
    }
    return userQueue
  }

  /**
  * Increments the queueOffset to get the next track to be played
  * @function
  * @param {String} userId  - The ID of the user.
  * @param {Number} inc - The increment to add, either 1 or -1.
  */
  async finishTrack(userId, inc) {
    const userPlayer = await Player.findOne({ 'userId': userId })
    let newQueueOffset = (userPlayer.queueOffset + inc) % (userPlayer.queueTracksIds.length)
    newQueueOffset = newQueueOffset < 0 ? userPlayer.queueTracksIds.length-1 : newQueueOffset
    await Player.updateOne({ userId: userId }, { queueOffset: newQueueOffset })
  }
  /**
  * Increments the queueOffset to get the next/previous track to be played if the user has skips
  * @function
  * @param {String} userId  - The ID of the user.
  * @param {Number} dir - The dir of skipping, forward or backwards.
  */
  async skipTrack(userId, dir) {
    const userPlayer = await Player.findOne({ 'userId': userId })
    if (userPlayer.skipsMade == process.env.MAX_SKIPS) {
      if (Date.now() > userPlayer.skipsRefreshAt) {
        await Player.updateOne({ userId: userId }, { skipsMade: 1 })
        await this.finishTrack(userId,dir)
        return true
      }
      else {
        return false
      }
    }
    const newSkipsMade = userPlayer.skipsMade + 1
    await Player.updateOne({ userId: userId }, { skipsMade: newSkipsMade })
    if (newSkipsMade == process.env.MAX_SKIPS) {
      const newSkipRefreshAt = Date.now() + parseInt(process.env.SKIPS_REFRESH_TIME, 10) * 1000 // 60 minutes (*1000 to be in ms)
      await Player.updateOne({ userId: userId }, { skipsRefreshAt: newSkipRefreshAt })
    }
    await this.finishTrack(userId,dir)
    return true
  }
}



module.exports = playerService
