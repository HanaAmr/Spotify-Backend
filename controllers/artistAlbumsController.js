
/**
 * express module
 * @const
 */
const express=require('express')

/**
 * mongoose module
 * @const
 */
const mongoose = require('mongoose')

/**
 * mongoose Album model 
 * @const
 */
const Album= require('../models/albumModel')

/**
 * mongoose Track model 
 * @const
 */
const Track= require('../models/trackModel')

 /**
 * util to handle query parameters
 * @const
 */
const APIFeatures= require('./../utils/apiFeatures')

/**
 * App error object for creating errors
 * @const
 */
const AppError = require('../utils/appError')
/**
 * User service
 * @type {object}
 * @const
 */
const userService=require('./../services/userService')
const userServiceClass = new userService()
/**
 * catch async function for handling asynch functions
 * @const
 */
const catchAsync = require('./../utils/catchAsync')

/**
* A middleware function for addingAlbum for artist
* @function
* @memberof module:controllers/artistAlbumsController
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.addAlbum=catchAsync(async(req,res,next)=>{
    if(req.file)
        req.body.image=req.file.filename
    
    const artistId= await (userServiceClass.getUserId(req.headers.authorization))
    req.body.artist= new mongoose.Types.ObjectId(artistId)
       
    const newAlbum= await Album.create(req.body)
    res.status(200).json({
        status:"sucsess",
        data:newAlbum
    })
})


/**
* A middleware function for addingTracktoAlbum for artist where album id is passed as aparameter of request
* @function
* @memberof module:controllers/artistAlbumsController
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.addTracktoAlbum= catchAsync( async(req,res,next)=>{
    if (req.file)
        req.body.audioFilePath=req.file.filename

    console.log(req.body)
    const artistId= await (userServiceClass.getUserId(req.headers.authorization))
    req.body.artist= new mongoose.Types.ObjectId(artistId)
    req.body.album=new mongoose.Types.ObjectId(req.params.id)

    //incrementing number of tracks of albums
    let numberofTracks=(await Album.findById(req.params.id)).totalTracks
    numberofTracks++
    await Album.findByIdAndUpdate(req.params.id,{totalTracks: numberofTracks})

    req.body.trackNumber=numberofTracks
    const newTrack= await Track.create(req.body)

    res.status(200).json({
        status:"sucsess",
        data:newTrack
    })
})

/**
* A middleware function for getting Albums for logged in artist
* @function
* @memberof module:controllers/artistAlbumsController
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getArtistAlbums= catchAsync(async (req,res,next)=>{
    const artistId= await (userServiceClass.getUserId(req.headers.authorization))

    const features= new APIFeatures(Album.find({artist: artistId}),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
    
    const albums=await features.query

    if(albums.length==0)
        throw (new AppError("You did not create any albums yet!",484))

    res.status(200).json({
        status:"sucsess",
        data:albums
    })

})

/**
* A middleware function for getting tracksofAlbums for llogged in artist where album id is passed as aparameter of request
* @function
* @memberof module:controllers/artistAlbumsController
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getAlbumTracks= catchAsync(async (req,res,nex)=>{

    const albumTracks=await Track.find({album: req.params.id})

    if(albumTracks.length==0)
        throw (new AppError("Album is empty, Add more tracks",484))

    res.status(200).json({
        status:"sucsess",
        data:albumTracks
    })
})
