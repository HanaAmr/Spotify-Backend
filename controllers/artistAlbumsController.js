/**
 * Controller module.
 * @module controllers/artistAlbumsController
 * @requires express
 */

/**
 * Artist albums controller to call when routing.
 * @type {object}
 * @const
 */


 /**
 * Get Audio Duration Package, used to get duration of uploaded tracks
 * @const
 */
const { getAudioDurationInSeconds } = require('get-audio-duration')

/**
 * Mongoose package
 * @const
 */
const mongoose = require('mongoose')

/**
 * fs package for dealing with file system
 * @const
 */
const fs = require('fs')

/**
 * User model from the database
 * @const
 */
const User = require('../models/userModel')

/**
 * artistAlbum controller to call when routing.
 * @const
 */
const uploadService=require('../services/uploadService')

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
 * util to handle query params
 * @const
 */
const APIFeatures = require('./../utils/apiFeatures')

/**
 * Error handing module
 * @const
 */
const AppError = require('../utils/appError')

/**
 * user Service Class
 * @const
 */
const userService = require('./../services/userService')
const userServiceClass = new userService()

/**
 * catch async function for handling async functions
 * @const
 */
const catchAsync = require('./../utils/catchAsync')

/**
 * Notifications services
 * @const
 */
const NotificationServices = require('../services/notificationService')
const notificationService = new NotificationServices()

/**
 * A middleware function for addingAlbum for artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns album object created if album is created successfully or error object otherwise
 */
exports.addAlbum = catchAsync(async (req, res, next) => {
  if (req.file) { req.body.image = `${process.env.API_URL}/public/imgs/albums/${req.file.filename}`}
  else
  throw (new AppError('No file received, can\'t add album without an image', 484))
    

  if (req.body.totalTracks) { req.body.totalTracks = 0 }

  //adding the id of the artist to the newly created album
  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  req.body.artists = []
  req.body.artists.push(new mongoose.Types.ObjectId(artistId))

  let newAlbum = await Album.create(req.body)

  // updating uri and href of newely created albums
  const newUri = newAlbum.uri + newAlbum._id
  const newHref = newAlbum.href + newAlbum._id
  newAlbum = await Album.findByIdAndUpdate(newAlbum._id, { uri: newUri, href: newHref }, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    data: newAlbum
  })
})

/**
 * A middleware function for adding track to album for artist where album id is passed as a query parameter of request
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @param {String} albumId - album ID to add track to , passed in query
 * @return {JSON} Returns JSON object of added track if request is successful, an error object otherwise
 */
exports.addTracktoAlbum = catchAsync(async (req, res, next) => {

  //getting artist info and album for updating them latter
  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const artist = User.findById(artistId)
  const album = await Album.find({ _id: req.params.id, artists: artistId })
  //make sure that the artist owns this album and the audio file is passed
  if (album.length === 0) { throw (new AppError('You are not authorized, you cannot add tracks to albums other than yours!', 484)) }

  if (req.file) {
    req.body.audioFilePath = `tracks/${req.file.filename}`
    await getAudioDurationInSeconds(`${__dirname}/../tracks/${req.file.filename}`).then((duration) => {
      req.body.durationMs = duration * 1000
    })
  }
  else
  {
    throw (new AppError('No audio file received, can\'t add track without mp3 file', 484))
  }

  // inserting artists and album in the newly created track
  req.body.artists = []
  req.body.artists.push(new mongoose.Types.ObjectId(artistId))
  req.body.album = new mongoose.Types.ObjectId(req.params.id)

  // getting track number
  const trackAlbum=await Album.findById(req.params.id)
  let numberofTracks = trackAlbum.totalTracks+1
  req.body.trackNumber = numberofTracks
  let newTrack = await Track.create(req.body)

  // updating href and uri
  const newUri = newTrack.uri + newTrack._id
  const newHref = newTrack.href + newTrack._id
  newTrack = await Track.findByIdAndUpdate(newTrack._id, { uri: newUri, href: newHref }, {
    new: true,
    runValidators: true
  })

  //updating track album's number of tracks and track objects
  await Album.findByIdAndUpdate(req.params.id, { totalTracks: numberofTracks,$push:{trackObjects: newTrack._id} })
  //adding track to artist's track object
  await User.findByIdAndUpdate(artistId,{$push:{trackObjects: newTrack._id}})

  //Send notification to artist subscribers
  let i, notif
  const followers = artist.followers
  const title = `${artist.name} added a track!`
  const body = `${artist.name} has added track called ${newTrack.name}!`
  const images = artist.images
  const data = {'uri': newTrack.uri, 'id': newTrack._id, 'href':newTrack.href, 'image':trackAlbum.image}

  //sending notification if artist has followers
  if(followers)
  {
    for(i = 0; i < followers.length(); i++) 
      notif = await notificationService.generateNotification(title,body,followers[i].toString(),data)
    notif.topic = artistId
    delete notif.token
    await notificationService.sendNotificationTopic(notif)
  }


  res.status(200).json({
    status: 'success',
    data: newTrack
  })
})

/**
 * AA middleware function for getting Albums of logged in artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns list of Albums created by artist whether empty or not, or an error if artist has no albums
 */
exports.getArtistAlbums = catchAsync(async (req, res, next) => {
  const artistId = await (userServiceClass.getUserId(req.headers.authorization))

  const features = new APIFeatures(Album.find({ artists: artistId }).select('-__v'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const albums = await features.query.populate({
    path: 'artists',
    select: '_id name uri href externalUrls images role followers userStats artistInfo'

  })

  if (albums.length === 0) { throw (new AppError('You did not create any albums yet!', 484)) }

  res.status(200).json({
    status: 'success',
    data: albums
  })
})

/**
 * A middleware function of deleting artist album
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 */
exports.deleteAlbum=catchAsync(async (req, res, next) => {
  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const album=await Album.findById(req.params.id)

  if(!album)
    throw (new AppError('Can\'t find album with such an id', 404))

  if(!(album.artists.includes(artistId)))
    throw (new AppError('You are not allowed to delete albums that are not yours', 405))

  await Album.findByIdAndDelete(req.params.id)
  
  res.status(204).json({
    status: 'success'
  })
})


/**
 * A middleware function of deleting a track in a specific album
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 */
exports.deleteTrack=catchAsync(async (req, res, next) => {
  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const track= await Track.findById(req.params.id)

  if(!track)
     throw (new AppError('Can\'t find track with such an id', 404))

  if(!(track.artists.includes(artistId)))
    throw (new AppError('You are not allowed to delete tracks that are not yours', 405))

  await Track.findByIdAndDelete(req.params.id)
  res.status(204).json({
    status: 'success'
  })
})

/**
 * A middleware function of editing an artist album
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns the newly created album
 */
exports.editAlbum=catchAsync(async (req, res, next) => {

  if (req.file) { req.body.image = `${process.env.API_URL}/public/imgs/albums/${req.file.filename}` }
  else if(req.body.name)
  {
    const artistId = await (userServiceClass.getUserId(req.headers.authorization))
    const oldAlbum=await Album.findById(req.params.id)
    if(!(oldAlbum.artists.includes(artistId)))
      throw (new AppError('You are not allowed to delete albums that are not yours', 405))

    req.body.image=await uploadService.renameImage(req.body.name,oldAlbum.image)

  }

  const updatedAlbum= await Album.findByIdAndUpdate(req.params.id,req.body,{
    new: true,
    runValidators: true
})

res.status(200).json(
    {
        status: "success",
        data: {
          updatedAlbum
        }
    }
)
})

/**
 * A middleware function of editing an artist's track album
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns the newly created track
 */
exports.editTrack=catchAsync(async (req, res, next) => {
  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const track= await Track.findById(req.params.id)

  if(!(track.artists.includes(artistId)))
    throw (new AppError('You are not allowed to edit tracks that are not yours', 405))

  const updatedtrack= await Track.findByIdAndUpdate(req.params.id,req.body,{
    new: true,
    runValidators: true
})

res.status(200).json(
  {
      status: "success",
      data: {
        updatedtrack
      }
  }
)
})
