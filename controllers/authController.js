/** Express controller providing auth related controls
 * @module controllers/auth
 * @requires express
 */

/**
 * Auth controller to call when routing.
 * @type {object}
 * @const
 */

/**
 * util to import promisify function
 * @const
 */
const { promisify } = require('util')

/**
 * user object
 * @const
 */
const User = require('../models/userModel')

/**
 * track object
 * @const
 */
const Track = require('../models/trackModel')

/**
 * album object
 * @const
 */
const Album = require('../models/albumModel')

/**
 * playlist object
 * @const
 */
const Playlist = require('../models/playlistModel')

/**
 * Player object
 * @const
 */
const Player = require('../models/playerModel')

/**
 * jwt for tokens
 * @const
 */
const jwt = require('jsonwebtoken')

/**
 * catch async for async functions
 * @const
 */
const catchAsync = require('../utils/catchAsync')

/**
 * error object
 * @const
 */
const AppError = require('../utils/appError')

/**
 * API features utils file
 * @const
 */
const APIFeatures = require('./../utils/apiFeatures')

/**
 * Notifications services
 * @const
 */
const NotificationServices = require('../services/notificationService')
const notificationService = new NotificationServices()

/**
 * Artist services
 * @const
 */
const ArtistServices=require('../services/artistService')
const artistService= new ArtistServices()

// generating token using user id
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
}

/**
* A function for signing up users
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.signUp = catchAsync(async (req, res, next) => {
  // create a new user with the input data
  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender
  })

  //Create the player for the user
  await Player.create({
    userId: newUser._id
  })

  // generate a token for the new user
  const token = signToken(newUser._id)

  res.status(200).json({
    status: 'Success',
    success: true,
    expireDate: process.env.JWT_EXPIRE_IN,
    token
  })
})

/**
* A function for logging in users with facebook
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.loginWithFacebook = catchAsync(async (req, res, next) => {
  // if everything was fine generate and send a token to the user who logged in with facebook
  const token = signToken(req.user._id)

  res.status(200).json({
    status: 'Success',
    sucess: true,
    expireDate: process.env.JWT_EXPIRE_IN,
    token
  })
})

/**
* A function for signing in users
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email or password!', 400))
  }

  // check if email and password are correct
  const tempUser = await User.findOne({ email }).select('+password')
  if (!tempUser) {
    return next(new AppError('Incorrect email!', 401))
  }
  const correct = await tempUser.correctPassword(password, tempUser.password)
  if (!correct) {
    return next(new AppError('Incorrect password!', 401))
  }

  // generate and send token
  const token = signToken(tempUser._id)

  res.status(200).json({
    status: 'Success',
    success: true,
    expireDate: process.env.JWT_EXPIRE_IN,
    token
  })
})

/**
* A middleware function for token validation and verification
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.protect = catchAsync(async (req, res, next) => {
  let token

  // get token and check if it exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to access.', 401))
  }

  // verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET) // error handling

  // check if user still exists
  const freshUser = await User.findById(decoded.id)
  if (!freshUser) {
    return next(new AppError('The user belonging to this token does no longer exists', 401))
  }

  req.user = freshUser
  next()
})

/**
* A function that pass roles to a middleware function to check for authorization
* @alias module:controllers/auth
* @param {array} roles - The function takes the request as a parameter to access its body.
*/
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // check if the user role has a permission to a certain action
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403))
    }
    next()
  }
}

/**
* A function to get my profile
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getMyProfile = catchAsync(async (req, res, next) => {
  // get the user from database and send his data
  const newUser = await User.findById(req.user.id)

  res.status(200).json({
    name: newUser.name,
    email: newUser.email,
    gender: newUser.gender,
    dateOfBirth: newUser.dateOfBirth,
    images: newUser.images,
    followers: newUser.followers,
    following: newUser.following,
    uri: newUser.uri,
    href: newUser.href,
    userStats: newUser.userStats,
    artistInfo: newUser.artistInfo,
    role: newUser.role
  })
})



/**
* A function to get user profile
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getUserProfile = catchAsync(async (req, res, next) => {
  // get the user from database and send his data
  const newUser = await User.findById(req.params.id)

  if(!newUser) {
    return next(new AppError('Please enter a valid id', 400))
  }

  res.status(200).json({
    name: newUser.name,
    email: newUser.email,
    gender: newUser.gender,
    dateOfBirth: newUser.dateOfBirth,
    images: newUser.images,
    followers: newUser.followers,
    following: newUser.following,
    uri: newUser.uri,
    href: newUser.href,
    userStats: newUser.userStats,
    artistInfo: newUser.artistInfo,
    role: newUser.role
  })
})






/**
* A function to change user password
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.changePassword = catchAsync(async (req, res, next) => {
  // get user from database
  const user = await User.findById(req.user.id).select('+password')

  // check if the user sent the newpassword and the currentpassword
  if (!req.body.passwordConfirmation || !req.body.newPassword) {
    return next(new AppError('Please enter the required inputs', 400))
  }

  // check if currentpassword is correct
  if (!(await user.correctPassword(req.body.passwordConfirmation, user.password))) {
    return next(new AppError('Your Confirmation password is wrong', 401))
  }

  // change the cuurent password with the new one
  user.password = req.body.newPassword
  await user.save()

  res.status(200).json({
    status: 'Success'
  })
})

/**
* A function to update user
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.updateProfile = catchAsync(async (req, res, next) => {
  // get user from database
  const user = await User.findById(req.user.id)

  // update the user data with the new data and send the updated user
  user.email = req.body.email
  user.name = req.body.name
  user.gender = req.body.gender
  user.dateOfBirth = req.body.dateOfBirth
  await user.save()

  res.status(200).json({
    status: 'Success',
    user
  })
})

/**
* A function to follow artist or user
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.followArtistUser = catchAsync(async (req, res, next) => {
  // get the requesting user and the user who is going to be followed from database
  const user = await User.findById(req.user.id)
  const followedUser = await User.findById(req.body.id)

  // check if the id of the followed user is given
  if (!followedUser) {
    return next(new AppError('Please enter the id of the user you want to follow', 400))
  }

  // check if it is not the first time to follow this user
  if (user.following.includes(req.body.id)) {
    return next(new AppError('Already following this user', 400))
  }

  // user follows the followed user
  user.following.push(req.body.id)
  followedUser.followers.push(req.user.id)

  await user.save()
  await followedUser.save()

  //Send followed notification to followedUser
  const title = 'You have been followed!'
  const body = `${user.name} has followed you!`
  const followedUserId = await followedUser._id.toString()
  const userId = await user._id.toString()
  const images = user.images[0]
  const data = {'uri': user.uri, 'id': userId, 'href':user.href, 'images':images}
  const notif = await notificationService.generateNotification(title,body,followedUserId,data)
  await notificationService.sendNotification(followedUserId,notif)

  //Subscribe to the artist
  await notificationService.subscribeToTopic(user._id,followedUserId,1)

  res.status(204).json({
    status: 'Success'
  })
})




/**
* A function to like a track
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.likeTrack = catchAsync(async (req, res, next) => {

  // get the user and the track
  const user = await User.findById(req.user.id)
  let track = await Track.findById(req.body.id)


  // check if the id of the track is given
  if (!track) {
    return next(new AppError('Please enter the id of the track you want to like', 400))
  }

  // check if it is not the first time to like this track
  if (user.likedTracks.includes(req.body.id)) {
    return next(new AppError('Already like this track', 400))
  }
  
  await artistService.alterTrackorAlbumObjectLikes(track,req.user.id)
  user.likedTracks.push(req.body.id)

  await user.save()

  res.status(204).json({
    status: 'Success'
  })
})






/**
* A function to like an album
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.likeAlbum = catchAsync(async (req, res, next) => {

  // get the user and the album
  const user = await User.findById(req.user.id)
  const album = await Album.findById(req.body.id)


  // check if the id of the album is given
  if (!album) {
    return next(new AppError('Please enter the id of the album you want to like', 400))
  }

  // check if it is not the first time to like this album
  if (user.likedAlbums.includes(req.body.id)) {
    return next(new AppError('Already like this album', 400))
  }

  //adding like to artist stats
  await artistService.alterTrackorAlbumObjectLikes(album,req.user.id)

  // user like the album
  user.likedAlbums.push(req.body.id)

  await user.save()


  res.status(204).json({
    status: 'Success'
  })
})




/**
* A function to like a playlist
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.likePlaylist = catchAsync(async (req, res, next) => {

  // get the user and the playlist
  const user = await User.findById(req.user.id)
  const playlist = await Playlist.findById(req.body.id)

  // check if the id of the playlist is given
  if (!playlist) {
    return next(new AppError('Please enter the id of the playlist you want to like', 400))
  }

  // check if it is not the first time to like this playlist
  if (user.likedPlaylists.includes(req.body.id)) {
    return next(new AppError('Already like this playlist', 400))
  }

  // user like the playlist
  user.likedPlaylists.push(req.body.id)
  await user.save()

  //Send like notification to playlist owner
  const title = 'Someone liked a playlist you own!'
  const body = `${user.name} has liked the playlist ${playlist.name}!`
  const ownerId = playlist.owner.toString()
  const userId = user._id.toString()
  const images = user.images[0]
  const data = {'uri': user.uri, 'id': userId, 'href':user.href, 'images':images}
  const notif = await notificationService.generateNotification(title,body,ownerId,data)
  await notificationService.sendNotification(ownerId,notif)


  res.status(204).json({
    status: 'Success'
  })
})






/**
* A function to get created playlists
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getCreatedPlaylists=catchAsync(async (req, res, next) => {

  const user = await User.findById(req.user.id)

  if (user.createdPlaylists.length==0) {
    return next(new AppError('You did not create any playlist', 404))
  }

  const features = new APIFeatures(Playlist.find().where('_id').in(user.createdPlaylists), req.query).paginate().limitFieldsPlaylist()
  const playlists = await features.query

  res.status(200).json({
    status: 'success',
    data: {
      playlists
    }
  })

})



/**
* A function to unfollow artist or user
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.unfollowArtistUser = catchAsync(async (req, res, next) => {
  // get the requesting user and the user who is going to be unfollowed from database
  const user = await User.findById(req.user.id)
  const unfollowedUser = await User.findById(req.body.id)

  // check if the id of the unfollowed user is given
  if (!unfollowedUser) {
    return next(new AppError('Please enter the id of the user you want to unfollow', 400))
  }

  // check if you are not following this user
  if (!user.following.includes(req.body.id)) {
    return next(new AppError('You are not following this user', 400))
  }


  // user unfollows the unfollowed user
  const toBeRemoved = (element) => element == req.body.id;
  user.following.splice(user.following.findIndex(toBeRemoved), 1)

  const toBeRemoved1 = (element) => element == req.user.id;
  unfollowedUser.followers.splice(unfollowedUser.followers.findIndex(toBeRemoved1), 1)

  await user.save()
  await unfollowedUser.save()


  //UnSubscribe to the artist
  const unfollowedUserId = await unfollowedUser._id.toString()
  await notificationService.subscribeToTopic(user._id,unfollowedUserId,0)
  


  res.status(204).json({
    status: 'Success'
  })
})


/**
* A function to unlike a track
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.unlikeTrack = catchAsync(async (req, res, next) => {

  // get the user and the track
  const user = await User.findById(req.user.id)
  
  if(!req.body.id || !user.likedTracks.includes(req.body.id)) {
    return next(new AppError("User doesn't like this track", 400))
  }

  const toBeRemoved = (element) => element == req.body.id;
  
  user.likedTracks.splice(user.likedTracks.findIndex(toBeRemoved), 1)
  await user.save()


  res.status(204).json({
    status: 'Success'
  })
})




/**
* A function to unlike a album
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.unlikeAlbum = catchAsync(async (req, res, next) => {

  // get the user and the alvum
  const user = await User.findById(req.user.id)
  
  if(!req.body.id || !user.likedAlbums.includes(req.body.id)) {
    return next(new AppError("User doesn't like this album", 400))
  }

  const toBeRemoved = (element) => element == req.body.id;
  
  user.likedAlbums.splice(user.likedAlbums.findIndex(toBeRemoved), 1)
  await user.save()


  res.status(204).json({
    status: 'Success'
  })
})



/**
* A function to unlike a Playlist
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.unlikePlaylist = catchAsync(async (req, res, next) => {

  // get the user and the playlist
  const user = await User.findById(req.user.id)
  
  if(!req.body.id || !user.likedPlaylists.includes(req.body.id)) {
    return next(new AppError("User doesn't like this Playlist", 400))
  }

  const toBeRemoved = (element) => element == req.body.id;
  
  user.likedPlaylists.splice(user.likedPlaylists.findIndex(toBeRemoved), 1)
  await user.save()


  res.status(204).json({
    status: 'Success'
  })
})



/**
* A function to remove image
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.removeImage = catchAsync(async (req, res, next) => {

  // get the user 
  const user = await User.findById(req.user.id)
  
  //check if he doesn't has an image
  if(!user.images[0]) {
    return next(new AppError("User doesn't has an image", 400))
  }

  //remove image
  user.images = []
  await user.save()

  
  res.status(200).json({
    status: 'Image removed successfully'
  })
})




/**
* A function to change image
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.changeImage = catchAsync(async (req, res, next) => {

  // get the user 
  const user = await User.findById(req.user.id)

  if (req.file) {
  user.images = `${process.env.API_URL}/public/imgs/users/${req.file.filename} `
  await user.save()
  }
  

  res.status(200).json({
    status: 'Image updated'
  })
})






/**
* A function to create playlist
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.createPlaylist = catchAsync(async (req, res, next) => {

  // get the user 
  const user = await User.findById(req.user.id)

  // create a new playlist with the input data
  const playlist = await Playlist.create({
    name: req.body.name,
    description: req.body.description,
    public: req.body.public,
    collaborative: req.body.collaborative    
  })

  playlist.owner = user
  await playlist.save()

  user.createdPlaylists.push(playlist._id)
  await user.save()

  res.status(200).json({
    playlist
  })
})




/**
* A function to add track to a playlist
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.addTrackToPlaylist = catchAsync(async (req, res, next) => {
 
  const playlist = await Playlist.findById(req.params.playlistId)
  const track = await Track.findById(req.body.id)



  if(!playlist) {
    return next(new AppError("There is no playlist with this id", 400))
  }

  if(!track) {
    return next(new AppError("Enter the track id", 400))
  }

  if(playlist.trackObjects.includes(req.body.id)) {
    return next(new AppError("This track is already in the playlist", 400))
  }

  playlist.trackObjects.push(req.body.id)
  await playlist.save()

  res.status(200).json({
    playlist
  })
})



/**
* A function to get followed artist or user
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getfollowedArtistUser= catchAsync(async (req, res, next) => {

  const user = await User.findById(req.user.id)
  if (user.following.length==0) {
    return next(new AppError('You did not follow any artist/user', 404))
  }

  const users = await User.find().where('_id').in(user.following).select('_id name uri href externalUrls images role followers userStats artistInfo')

  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  })

})

/**
* A function to get followed artists 
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getfollowedArtists= catchAsync(async (req, res, next) => {

  const user = await User.findById(req.user.id)
  const users = await User.find({role:'artist'}).where('_id').in(user.following).select('_id name uri href externalUrls images role followers userStats artistInfo')

  if (users.length==0) {
    return next(new AppError('You did not follow any artist', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  })

})

/**
* A function to get user's followers 
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getUserfollowers= catchAsync(async (req, res, next) => {

  const user = await User.findById(req.user.id)
  if (user.followers.length==0) {
    return next(new AppError('You do not have any followers', 404))
  }

  const users = await User.find().where('_id').in(user.followers).select('_id name uri href externalUrls images role followers userStats artistInfo')

  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  })

})

/**
* A function to get liked playlists
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getLikedPlaylists=catchAsync(async (req, res, next) => {

  const user = await User.findById(req.user.id)

  if (user.likedPlaylists.length==0) {
    return next(new AppError('You did not like any playlist', 404))
  }

  const features = new APIFeatures(Playlist.find().where('_id').in(user.likedPlaylists), req.query).paginate().limitFieldsPlaylist()
  const playlists = await features.query

  res.status(200).json({
    status: 'success',
    data: {
      playlists
    }
  })

})

/**
* A function to get liked albums
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getLikedAlbums=catchAsync(async (req, res, next) => {

  const user = await User.findById(req.user.id)

  if (user.likedAlbums.length==0) {
    return next(new AppError('You did not like any album', 404))
  }

  const albums = await Album.find().where('_id').in(user.likedAlbums).select('-__v').populate({
    path: 'artists',
    select: '_id name uri href externalUrls images role followers userStats artistInfo' // user public data

  })

  res.status(200).json({
    status: 'success',
    data: {
      albums
    }
  })

})



/**
* A function to get liked tracks
* @alias module:controllers/auth
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getLikedTracks=catchAsync(async (req, res, next) => {

  const user = await User.findById(req.user.id)

  if (user.likedTracks.length==0) {
    return next(new AppError('You did not like any track', 404))
  }

  const features = new APIFeatures(Track.find().where('_id').in(user.likedTracks), req.query).limitFieldsTracks().paginate()
  const tracks = await features.query

  res.status(200).json({
    status: 'success',
    data: {
      tracks
    }
  })

})
