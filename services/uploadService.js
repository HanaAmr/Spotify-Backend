/**
 * multer package for dealing with files
 * @const
 */
const multer= require('multer')

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
const userService=require('./../services/userService')
const userServiceClass = new userService()

/**
* Multer Filter for setting storage path of album images to public/imgs/albums and naming the file with the following format:
* artistid-album-albumname-data.fileextension
* @function
* @memberof module:services/uploadService
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {file} - The function takes the file passed in the form data as a parameter to access its body.
* @param {cb} - The call back of the function
*/
const multerAlbumImageStorage=multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'public/imgs/albums')
    },
    filename: async (req,file,cb)=>{
        const artistId= await (userServiceClass.getUserId(req.headers.authorization))
        const albumName=req.body.name.split(' ').join('_')
        const fileExtension= file.mimetype.split('/')[1]
        cb(null,`${artistId}-album-${albumName}-${Date.now()}.${fileExtension}`)
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
const multerTrackStorage=multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'tracks')
    },
    filename: async (req,file,cb)=>{
        const AlbumId= req.params.id
        const trackName=req.body.name.split(' ').join('_')
        const fileExtension= file.mimetype.split('/')[1]
        cb(null,`${AlbumId}-${trackName}-${Date.now()}.${fileExtension}`)
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
const multerFilterImage=(req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }
    else{
        cb(new AppError('Not an image, Please upload only image!',400),false)
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
const multerFilterAudio=(req,file,cb)=>{
    if(file.mimetype.startsWith('audio')){
        cb(null,true)
    }
    else{
        cb(new AppError('Not an mp3 file, Please upload only audio files!',400),false)
    }
}

/**
* A function for creating multer object and assigning it to storage and filter for the albumImage
* @function 
* @memberof module:services/uploadService
*/
const uploadImage=multer({
    storage: multerAlbumImageStorage,
    fileFilter: multerFilterImage
})

/**
* A function for creating multer object and assigning it to storage and filter for the track
* @function 
* @memberof module:services/uploadService
*/
const uploadTrack=multer({
    storage: multerTrackStorage,
    fileFilter: multerFilterAudio
})

/**
* A middleware function for uploadingAlbumImage
* @function 
* @memberof module:services/uploadService
*/
exports.uploadAlbumImage=uploadImage.single('image')


/**
* A middleware function for uploadingTrackAudio for artist 
* @function
*  @function 
* @memberof module:services/uploadService
*/
exports.uploadTrackAudio=uploadTrack.single('trackAudio')