/**
 * Controller module.
 * @module controllers/artistViewingController
 * @requires express
 */

/**
 * artist viewing(in user mode) controller to call when routing.
 * @type {object}
 * @const
 */


/**
 * util to handle query parameters
 * @const
 */
const APIFeatures = require('./../utils/apiFeatures')

/**
 * mongoose model for user
 * @const
 */
const User = require('./../models/userModel')

/**
 * mongoose model for album
 * @const
 */
const Album = require('./../models/albumModel')

/**
 * mongoose model for playlist
 * @const
 */
const Playlist = require('./../models/playlistModel')

/**
 * mongoose model for track
 * @const
 */
const Track = require('./../models/trackModel')

/**
 * App error object
 * @const
 */
const AppError = require('../utils/appError')

/**
 * catch async function for handling async functions
 * @const
 */
const catchAsync = require('./../utils/catchAsync')

/**
 * A middleware function for Returning An array of Artists (with only public fields)
 * @alias module:controllers/artistViewingController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @return {JSON} Returns JSON array of Artist object
 */
exports.getArtists = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find({ role: 'artist' },
    {
      _id: 1,
      name: 1,
      uri: 1,
      href: 1,
      externalUrls: 1,
      images: 1,
      type: 1,
      followers: 1,
      artistInfo: 1,
      role:1
    }), req.query)
    .filter()
    .sort()
    .paginate()

  const artists = await features.query
  res.status(200).json({
    status: 'success',
    data: artists
  })
})

/**
 * A middleware function for Returning an artist (with only public fields) whose id is specified in the query
 *  @alias module:controllers/artistViewingController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} id - id of artist
 * @return {JSON} Returns JSON object of artist if id is valid or an error object Otherwise
 */
exports.getArtist = catchAsync(async (req, res, next) => {
  const artist = await User.findById(req.params.id,
    {
      _id: 1,
      name: 1,
      uri: 1,
      href: 1,
      externalUrls: 1,
      images: 1,
      role: 1,
      followers: 1,
      artistInfo: 1
    })
  if (artist == null || artist.role !== 'artist') { throw (new AppError('No artist with such an ID', 404)) }

  res.status(200).json({
    status: 'success',
    data: artist
  })
})

/**
 * A middleware function for Returning related artists to the passed artist id in the query
 * @alias module:controllers/artistViewingController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} id - id of artist
 * @return {JSON} Returns JSON array of artist objects if id is valid and related artists exist or an error object Otherwise
 */
exports.getRelatedArtists = catchAsync(async (req, res) => {
  const artist = await User.findById(req.params.id)
  if (artist == null || artist.role !== 'artist') { throw (new AppError('No artist with such an ID', 404)) }

  const genres = artist.artistInfo.genres

  let relatedArtists = await User.find({ role: 'artist', 'artistInfo.genres': { $in: genres } },
    {
      _id: 1,
      name: 1,
      uri: 1,
      href: 1,
      externalUrls: 1,
      images: 1,
      role: 1,
      followers: 1,
      artistInfo: 1
    })

  // removing current artist
  relatedArtists = relatedArtists.filter(el => el.id !== artist.id)

  if (relatedArtists.length === 0) { throw (new AppError('No related artists found for this artist!', 404)) }

  res.status(200).json({
    status: 'success',
    data: relatedArtists
  })
})


/**
 * A middleware function for Returning albums of artist whose id is passed in the query
 *  @alias module:controllers/artistViewingController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} id - id of artist
 * @return {JSON} Returns JSON array of album objects if id is valid and artist have albums. Otherwise, returns an error object
 */
exports.getArtistAlbums = catchAsync(async (req, res, next) => {

  const artist = await User.findById(req.params.id)
  if (artist == null || artist.role !== 'artist') { throw (new AppError('No artist with such an ID', 404)) }

  const features = new APIFeatures(Album.find({ artists: req.params.id, totalTracks: { $gt: 0 } }), req.query)
    .filter()
    .sort()
    .paginate()

  const albums = await features.query.populate({
    path: 'artists',
    select: '_id name uri href externalUrls images role followers userStats artistInfo'
  })

  if (albums.length === 0) { throw (new AppError('No albums for this artist!', 404)) }

  res.status(200).json({
    status: 'success',
    data: albums
  })
})


/**
 * A middleware function for returning TopTracks for artist whose id is passed in the query
 *  @alias module:controllers/artistViewingController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} id - id of artist
 * @return {JSON} Returns JSON array of track objects if id is valid and artist have tracks. Otherwise, returns an error object
 */
exports.getArtistTopTracks = catchAsync(async (req, res, next) => {
  const artist = await User.findById(req.params.id)
  if (artist == null || artist.role !== 'artist') { throw (new AppError('No artist with such an ID', 404)) }

  req.query.sort = '-popularity'
  const features = new APIFeatures(Track.find({ artists: req.params.id }).select('-__v -audioFilePath'), req.query)
    .filter()
    .sort()
    .limitFieldsTracks()
    .paginate()

  const tracks = await features.query

  if (tracks.length === 0) { throw (new AppError('No tracks for artist', 404)) }

  res.status(200).json({
    status: 'success',
    data: tracks
  })
})


/**
 * A middleware function for returning CreatedPlaylists for artist whose id is passed in the query
 *  @alias module:controllers/artistViewingController
 * @param {Object} req - The request passed.
 * @param {Object} res - The respond sent
 * @param {Function} next - The next function in the middleware
 * @param {String} id - id of artist
 * @return {JSON} Returns JSON array of playlist objects if id is valid and artist have have createdPlaylists. Otherwise, returns an error object
 */
exports.getArtistCreatedPlaylists = catchAsync(async (req, res, next) => {
  const artist = await User.findById(req.params.id)

  if (artist === null || artist.role !== 'artist') { throw (new AppError('No artist with such an ID', 404)) }


  const playlists = await Playlist.find({ owner: req.params.id })
  if (playlists.length === 0) { throw (new AppError('No created playlists for artist', 404)) }

  res.status(200).json({
    status: 'success',
    data: playlists
  })
})
