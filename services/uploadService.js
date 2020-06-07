/** Express service for Emailing
 * @module services/uploadService
 * @requires multer
 */

/**
 * multer package for dealing with files
 * @const
 */
const multer = require('multer')

/**
 * For dealing with file paths
 * @const
 */
const path = require('path')

/**
 * fs for dealing with file systems
 * @const
 */
const fs=require('fs')

/**
* AppError class file
* @const
*/
const AppError = require('./../utils/appError')

/**
 * audio duration package for measuring duration of mp3
 * @const
 */
const { getAudioDurationInSeconds } = require('get-audio-duration')

/**
 * User service
 * @type {object}
 * @const
 */
const userService = require('./../services/userService')
const userServiceClass = new userService()

/**
 * Express object
 * Album model
 * @type {object}
 * @const
 */
const Album=require('../models/albumModel')


/**
* Function that get the image full path given the URL stored in the database
* @function
* @memberof module:services/uploadService
* @param {albumImage} - image attribute in the album object that holds image URL
*/
const getImageAbsolutePath= function(albumImage)
{
  let fullPath = path.join(__dirname, '../');
  fullPath+= "public/imgs/albums/"
  //removes the server name and get its relative path in the imgs folder
  const imgPath=albumImage.split('/').pop()
  fullPath= path.join(fullPath,imgPath)
  return fullPath
}

/**
* Function that deletes the old picture of the album from the server when uploading a new one,gven it's absolute(full) path
* @function
* @memberof module:services/uploadService
* @param {path} - Full path of the old image
*/
const deleteImagePath=async(path)=>
{
  fs.unlink(path,err=>
    {
      if(err)
         console.log("No image for album")
    })
}


/**
* A function that renames an existing image in the server with the album's new name
* @function
* @memberof module:services/uploadService
* @param {name}  - The new name of the album
* @param {albumImage} - The old url of the image to extract it's path 
*/
 exports.renameImage=async(name,albumImage)=>{

  oldPath=getImageAbsolutePath(albumImage)

  //extracting the new path of the album by replacing the album name
  let newPath=albumImage.split('-')
  newPath[2]=name.split(' ').join('_')
  newPath=newPath.join('-')
  const newImagePath=newPath
  newPath=newPath.split('/').pop()
  let fullPath = path.join(__dirname, '../');
  fullPath+= "public/imgs/albums/"
  newPath=fullPath+newPath
  console.log(newPath)

  //system call to rename the file
  fs.rename(oldPath,newPath,err=>{
    if(err)
      console.log('cannot find img')
  })
  //return the new URL of the image so i can be updted in the database
  return newImagePath
}

/**
* Multer storage function for setting storage path of album images to public/imgs/albums and naming the file with the following format:
* artistid-album-albumname-data.fileextension
* @function
* @memberof module:services/uploadService
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {file} - The function takes the file passed in the form data as a parameter to access its body.
* @param {cb} - The call back of the function
*/
const multerAlbumImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/imgs/albums')
  },
  filename: async (req, file, cb) => {
    const artistId = await (userServiceClass.getUserId(req.headers.authorization))
    const albumName = req.body.name.split(' ').join('_')
    const fileExtension = file.mimetype.split('/')[1]
    cb(null, `${artistId}-album-${albumName}-${Date.now()}.${fileExtension}`)
  }
})

/**
* Multer storage function for deleting old album image,setting storage path of album images to public/imgs/albums 
* and naming the file with the following format:
* artistid-album-albumname-data.fileextension
* @function
* @memberof module:services/uploadService
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {file} - The function takes the file passed in the form data as a parameter to access its body.
* @param {cb} - The call back of the function
*/
const multerUpdateAlbumImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/imgs/albums')
  },
  filename: async (req, file, cb) => {
    const album=await Album.findById(req.params.id)
    const artistId = await (userServiceClass.getUserId(req.headers.authorization))
    if(!(album.artists.includes(artistId)))
      throw (new AppError('You are not allowed to delete albums that are not yours', 405))

    const path=getImageAbsolutePath(album.image)
    await deleteImagePath(path)
    let albumName

    if(req.body.name)
      albumName = req.body.name.split(' ').join('_')
    else
      albumName=album.name.split(' ').join('_')

    const fileExtension = file.mimetype.split('/')[1]
    cb(null, `${artistId}-album-${albumName}-${Date.now()}.${fileExtension}`)
  }
})

/**
* Multer Filter for setting storage path of user images to public/imgs/users and naming the file with the following format:
* userid-data.fileextension
* @function
* @memberof module:services/uploadService
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {file} - The function takes the file passed in the form data as a parameter to access its body.
* @param {cb} - The call back of the function
*/
const multerUserImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/imgs/users')
  },
  filename: async (req, file, cb) => {
    const userId = await (userServiceClass.getUserId(req.headers.authorization))
    const fileExtension = file.mimetype.split('/')[1]
    cb(null, `${userId}-${Date.now()}.${fileExtension}`)
  }
})

/**
* Multer Filter for setting storage path of track audio to /tracks and naming the file with the following format:
* AlbumId-TrackName-Date.fileExtension
* @function
* @memberof module:services/uploadService
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {file} - The function takes the file passed in the form data as a parameter to access its body.
* @param {cb} - The call back of the function
*/
const multerTrackStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tracks')
  },
  filename: async (req, file, cb) => {
    const AlbumId = req.params.id
    const trackName = req.body.name.split(' ').join('_')
    const fileExtension = file.mimetype.split('/')[1]
    cb(null, `${AlbumId}-${trackName}-${Date.now()}.${fileExtension}`)
  }
})

/**
* Multer Filter function to filter only image fles
* @function
* @memberof module:services/uploadService
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {file} - The function takes the file passed in the form data as a parameter to access its body.
* @param {cb} - The call back of the function
*/
const multerFilterImage = (req, file, cb) => {
  
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image, Please upload only image!', 400), false)
  }
}

/**
* Multer Filter function to filter only audio fles
* @function
* @memberof module:services/uploadService
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {file} - The function takes the file passed in the form data as a parameter to access its body.
* @param {cb} - The call back of the function
*/
const multerFilterAudio = (req, file, cb) => {
  if (file.mimetype.startsWith('audio')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an mp3 file, Please upload only audio files!', 400), false)
  }
}

/**
* A function for creating multer object and assigning it to storage and filter for the albumImage
* @function
* @memberof module:services/uploadService
*/
const uploadImage = multer({
  storage: multerAlbumImageStorage,
  fileFilter: multerFilterImage
})

const changeAlbumImage=multer({
  storage:multerUpdateAlbumImageStorage,
  fileFilter:multerFilterImage
})
/**
* A function for creating multer object and assigning it to storage and filter for the userImage
* @function
* @memberof module:services/uploadService
*/
const changeImage = multer({
  storage: multerUserImageStorage,
  fileFilter: multerFilterImage
})


/**
* A function for creating multer object and assigning it to storage and filter for the track
* @function
* @memberof module:services/uploadService
*/
const uploadTrack = multer({
  storage: multerTrackStorage,
  fileFilter: multerFilterAudio
})

/**
* A middleware function for updatingAlbumImage
* @function
* @memberof module:services/uploadService
*/
exports.uploadAlbumImage = uploadImage.single('image')

/**
* A middleware function for uploadingAlbumImage
* @function
* @memberof module:services/uploadService
*/
exports.updateAlbumImage = changeAlbumImage.single('image')

/**
* A middleware function for uploadingUserImage
* @function
* @memberof module:services/uploadService
*/
exports.uploadUserImage = changeImage.single('image')


/**
* A middleware function for uploadingTrackAudio for artist
* @function
*  @function
* @memberof module:services/uploadService
*/
exports.uploadTrackAudio = uploadTrack.single('trackAudio')