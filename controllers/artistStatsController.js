/**
 * Controller module.
 * @module controllers/artistStatsController
 * @requires express
 */

/**
 * Mongoose package
 * @const
 */
const mongoose = require('mongoose')

 /**
 * Album model from the database
 * @const
 */
const Album = require('../models/albumModel')

/**
 * Track model from the database
 * @const
 */
const Track = require('../models/trackModel')

/**
 * Error handing module
 * @const
 */
const AppError = require('../utils/appError')

/**
 * catch async function for handling async functions
 * @const
 */
const catchAsync = require('./../utils/catchAsync')

/**
 * Moment package for dealing with datess
 * @const
 */
const moment = require('moment')


/**
 * user Service Class used to get artist ID from token
 * @const
 */
const userService = require('./../services/userService')
const userServiceClass = new userService()

/**
 * artist Service Class for making the necessary calculation functions
 * @const
 */
const artistService = require('./../services/artistService')
const artistServiceClass = new artistService()

/**
 * A middleware function for getting last 30 days likes statitics for track uploaded by artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns an array of objects containing the day and number of likes per day
 */
exports.getDailyTrackStats=catchAsync(async (req, res, next) => {

  const artistId = await (userServiceClass.getUserId(req.headers.authorization))

    const track= await Track.findById(req.params.id)
    if(!track)
      throw (new AppError('No track with this ID', 404))
    
    if(!(track.artists.includes(artistId)))
      throw (new AppError('You are not allowed to view statitics of tracks that are not yours', 401))

    const likedObjects=track.likesHistory
    let likes30Days=[]

    //If Track has more than 30 days of likes history take only last 30 days
    if(likedObjects.length>30)
      for(var i=30;i<30;i++)
        likes30Days.push(likedObjects.pop())

    //if track has less than 30 days of likes history , Insert zeros at begining(past history)
    else if(likedObjects.length<30)
      {
        console.log(30-likedObjects.length)
        console.log(likedObjects[0].day)

        var oldDate=new Date(likedObjects[0].day)
        oldDate.setDate(oldDate.getDate()-(30-likedObjects.length))
        for(var i=0;i<30-likedObjects.length;i++)
          {
            let likesPerDayObj=new Object()
            likesPerDayObj.day=new Date(oldDate)
            likesPerDayObj.numberOfLikes=0
            likes30Days.push(likesPerDayObj)
            oldDate.setDate(oldDate.getDate()+1)
          }
          //adding history already saved in track
          for(var i=0;i<likedObjects.length;i++)
            likes30Days.push(likedObjects[i])
      }
    //If track has likes history of exactly 30 days
    else
      likes30Days=likedObjects
    
    res.status(200).json({
        status: 'success',
        data: likes30Days
      })
})



/**
 * A middleware function for getting last 30 days listens statitics for track uploaded by artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns an array of objects containing the day and number of listens per day
 */
exports.getTrackDailyListensStats=catchAsync(async (req, res, next) => {

  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const track= await Track.findById(req.params.id)
  if(!track)
      throw (new AppError('No track with this ID', 404))

  if(!(track.artists.includes(artistId)))
    throw (new AppError('You are not allowed to view statitics of tracks that are not yours', 401))

  listensDailyStats=await artistServiceClass.calculateNumberOfDailyLikes(track)
  
  res.status(200).json({
    status: 'success',
    data: listensDailyStats
  })

})

/**
 * A middleware function for getting last 30 days listens statitics for album uploaded by artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns an array of objects containing the day and number of listens per day
 */
exports.getAlbumDailyListensStats=catchAsync(async (req, res, next) => {

  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const album= await Album.findById(req.params.id)
  if(!album)
      throw (new AppError('No album with this ID', 404))

  if(!(album.artists.includes(artistId)))
    throw (new AppError('You are not allowed to view statitics of albums that are not yours', 401))

  listensDailyStats=await artistServiceClass.calculateNumberOfDailyLikes(album)
  
  res.status(200).json({
    status: 'success',
    data: listensDailyStats
  })

})
//Used for filtering l hagat l rag3a
//let likedObjects=track.likesPerDay.filter(likesPerDay=> likesPerDay.day>= today.toDate())