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
 * A middleware function for addingAlbum for artist
 *  @alias module:controllers/artistAlbumsController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} token - userArtist Token passed in header
 * @return {JSON} Returns album object created if album is created sucessfully or error object otherwise
 */
exports.addAlbum = catchAsync(async (req, res, next) => {
  if (req.file) { req.body.image = `${process.env.API_URL}/public/imgs/albums/${req.file.filename} ` }

  if (req.body.totalTracks) { req.body.totalTracks = 0 }

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
    status: 'sucsess',
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
 * @return {JSON} Returns JSON object of added track if request is sucessful, an error object otherwise
 */
exports.addTracktoAlbum = catchAsync(async (req, res, next) => {
  const artistId = await (userServiceClass.getUserId(req.headers.authorization))
  const album = await Album.find({ _id: req.params.id, artists: artistId })
  if (album.length === 0) { throw (new AppError('You are not authorized, you cannot add tracks to albums other than yours!', 484)) }

  if (req.file) {
    req.body.audioFilePath = `tracks/${req.file.filename}`
    await getAudioDurationInSeconds(`${__dirname}/../tracks/${req.file.filename}`).then((duration) => {
      req.body.durationMs = duration * 1000000
    })
  }
  else
  {
    throw (new AppError('No file received', 484))
  }

  // inserting artists and album in req body
  req.body.artists = []
  req.body.artists.push(new mongoose.Types.ObjectId(artistId))
  req.body.album = new mongoose.Types.ObjectId(req.params.id)

  // updating album to increment number of tracks
  let numberofTracks = (await Album.findById(req.params.id)).totalTracks
  numberofTracks++
  await Album.findByIdAndUpdate(req.params.id, { totalTracks: numberofTracks })

  req.body.trackNumber = numberofTracks
  let newTrack = await Track.create(req.body)

  // updating href and uri
  const newUri = newTrack.uri + newTrack._id
  const newHref = newTrack.href + newTrack._id
  newTrack = await Track.findByIdAndUpdate(newTrack._id, { uri: newUri, href: newHref }, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'sucsess',
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
    status: 'sucsess',
    data: albums
  })
})

// /**
// * A middleware function for getting tracksofAlbums for llogged in artist where album id is passed as aparameter of request
// * @function
// * @memberof module:controllers/artistAlbumsController
// * @param {Request}  - The function takes the request as a parameter to access its body.
// * @param {Respond} - The respond sent
// * @param {next} - The next function in the middleware
// */
// exports.getAlbumTracks= catchAsync(async (req,res,nex)=>{

//     const albumTracks=await Track.find({album: req.params.id})

//     if(albumTracks.length==0)
//         throw (new AppError("Album is empty, Add more tracks",484))

//     res.status(200).json({
//         status:"sucsess",
//         data:albumTracks
//     })
// })
