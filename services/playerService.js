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
 * API features utils file
 * @const
 */
const APIFeatures = require('./../utils/apiFeatures')

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
  constructor (userService) {
    this.userService = userService
  }

  /**
    * Checks if track requested can be played by user or not.
    * @function
    * @param {String} authToken - The authorization token of the user.
    * @param {String} trackId - The id of the track to be played
    * @returns {Number} 1 if can be played, -1 if can't be played because ad must be played, -2 if song requested isn't the one in the queue.
    */
  async validateTrack (authToken, trackId) {
    const userId = await userService.getUserId(authToken)
    const userPlayer = await Player.findOne({ userId: userId })
    const userRole = await userService.getUserRole(authToken)
    if (userRole != 'user') {
      let newQueueOffset = userPlayer.queueOffset
      let max = 0
      while (userPlayer.queueTracksIds[newQueueOffset] != trackId && max != userPlayer.queueTracksIds.length + 5) {
        newQueueOffset = (newQueueOffset + 1) % (userPlayer.queueTracksIds.length)
        max++
      }
      if (userPlayer.queueTracksIds[newQueueOffset] != trackId) { return -3 }
      userPlayer.queueOffset = newQueueOffset
      userPlayer.save()
      return 1
    }
    // If user should play one track
    if (userPlayer.tracksPlayed / parseInt(process.env.ADS_COUNTER, 10) > userPlayer.adsPlayed) { return -1 }
    // If track requested isn't the one in order in the shuffled list
    if (userPlayer.queueTracksIds[userPlayer.queueOffset] != trackId) { return -2 }
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
  async generateContext (id, type, userId) {
    const user = await User.findById(userId)
    // Get the user player
    const userPlayer = await Player.findOne({ userId: userId })
    // Create the queue of tracks
    let queueTracksIds
    // Get the context for the user if exists, if not create it.Then update its id and type
    const newContext = userPlayer.context == null ? new Context() : userPlayer.context
    newContext.id = id
    newContext.type = type
    // Update the context and queueTracksIds based on type of context
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
      newContext.images[0] = contextAlbum.image
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
    // Get user player and update the queue with shuffled list and the userPlayer context
    userPlayer.context = newContext
    userPlayer.queueTracksIds = queueTracksIds
    userPlayer.queueOffset = 0
    userPlayer.adsPlayed = 0
    userPlayer.tracksPlayed = 0
    await userPlayer.save()
    // Shuffle iff a normal user.
    const shuffledList = user.role == 'user' ? await this.shufflePlayerQueue(userId) : queueTracksIds
    userPlayer.queueTracksIds = shuffledList
    // Update the currently played track for the context
    const currTrack = await Track.findOne({ _id: userPlayer.queueTracksIds[userPlayer.queueOffset] })
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
  async getContext (userId) {
    const userPlayer = await Player.findOne({ userId: userId })
    const userContext = userPlayer.context
    return userContext
  }

  /**
    * Gets the current track playing id.
    * @function
    * @inner
    * @param {String} userId - The ID of the user.
    */
  async getCurrentTrack (userId) {
    const userPlayer = await Player.findOne({ userId: userId })
    const currTrack = userPlayer.queueTracksIds[userPlayer.queueOffset]
    return currTrack
  }

  /**
    * Checks if the user with this token has reached the maximum number of recently played items and if so deletes one recently played item.
    * @function
    * @param {String} userId  - The ID of the user.
    */
  async deleteOneRecentlyPlayedIfFull (userId) {
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
  async shufflePlayerQueue (userId) {
    const userPlayer = await Player.findOne({ userId: userId })
    const userQueue = await userPlayer.queueTracksIds
    // Using Fisher-Yates shuffling algorithm, shuffle the queue.
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
  async finishTrack (userId, inc) {
    const userPlayer = await Player.findOne({ userId: userId })
    let newQueueOffset = (userPlayer.queueOffset + inc) % (userPlayer.queueTracksIds.length)
    newQueueOffset = newQueueOffset < 0 ? userPlayer.queueTracksIds.length - 1 : newQueueOffset
    const newTracksPlayed = userPlayer.tracksPlayed + 1
    await Player.updateOne({ userId: userId }, { queueOffset: newQueueOffset, tracksPlayed: newTracksPlayed })
  }

  /**
  * Increments the queueOffset to get the next/previous track to be played if the user has skips
  * @function
  * @param {String} userId  - The ID of the user.
  * @param {Number} dir - The dir of skipping, forward or backwards.
  * @param {Bool} userRole - The role of the user
  */
  async skipTrack (userId, dir, userRole) {
    if (userRole != 'user') {
      await this.finishTrack(userId, dir)
      return true
    }
    const userPlayer = await Player.findOne({ userId: userId })
    if (userPlayer.skipsMade == parseInt(process.env.MAX_SKIPS, 10)) {
      if (Date.now() > userPlayer.skipsRefreshAt) {
        await Player.updateOne({ userId: userId }, { skipsMade: 1 })
        await this.finishTrack(userId, dir)
        return true
      } else {
        return false
      }
    }
    const newSkipsMade = userPlayer.skipsMade + 1
    await Player.updateOne({ userId: userId }, { skipsMade: newSkipsMade })
    if (newSkipsMade == parseInt(process.env.MAX_SKIPS, 10)) {
      const newSkipRefreshAt = Date.now() + parseInt(process.env.SKIPS_REFRESH_TIME, 10) * 1000 // 60 minutes (*1000 to be in ms)
      await Player.updateOne({ userId: userId }, { skipsRefreshAt: newSkipRefreshAt })
    }
    await this.finishTrack(userId, dir)
    return true
  }

  /**
    * Increments the ads played for the user
    * @function
    * @param {String} userId  - The ID of the user.
    */
  async incrementAdsPlayed (userId) {
    const userPlayer = await Player.findOne({ userId: userId })
    userPlayer.adsPlayed = userPlayer.adsPlayed + 1
    await userPlayer.save()
  }

  /**
    * Gets a random ad for the user
    * @function
    * @returns {Object} Track object of the ad
    */
  async getRandomAd () {
    let i, j
    const adsIds = await Track.find({ isAd: true })
    if (adsIds.length == 0) return 'No Ads available now'
    // Get random number <= ads.length
    i = adsIds.length - 1
    j = Math.floor(Math.random() * (i + 1))
    const adId = adsIds[j]._id
    const features = new APIFeatures(Track.findById(adId), '').limitFieldsTracks()
    const ads = await features.query
    return ads
  }
}

module.exports = playerService
