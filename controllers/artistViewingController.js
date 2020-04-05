/** Express controller providing ArtistViewing related controls
 * @module controllers
 * @requires express
 */

 /**
 * ArtistViewing controller to call when routing.
 * @type {object}
 * @const
 * @namespace artistViewingController
 */

 /**
 * express module
 * util to import promisify function
 * @const
 */
const express= require('express')

 /**
 * util to handle query parameters
 * @const
 */
const APIFeatures= require('./../utils/apiFeatures')

/**
 * mongoose module
 * mongoose model for user
 * @const
 */
const User=require('./../models/userModel')

/**
 * mongoose module
 * mongoose model for album
 * @const
 */
const Album=require('./../models/albumModel')

/**
 * mongoose module
 * mongoose model for playlist
 * @const
 */
const Playlist=require('./../models/playlistModel')

/**
 * mongoose module
 * mongoose model for track
 * @const
 */
const Track=require('./../models/trackModel')

/**
 * App error object
 * @const
 */
const AppError = require('../utils/appError')

/**
 * catch async function for handling asynch functions
 * @const
 */
const catchAsync=require('./../utils/catchAsync')

/**
* A middleware function for Returning An array of Artists
* @function
* @memberof module:controllers/artitViewingController
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getArtists=catchAsync( async(req,res,next)=>{
    
    const features=new APIFeatures(User.find({role:'artist'},
        {type:0,password:0,email:0,resetPasswordToken:0,resetPasswordExpires:0,
        resetPasswordToken:0, resetPasswordExpires:0,becomePremiumToken:0,becomePremiumExpires:0,
        becomeArtistToken:0,becomeArtistExpires:0}),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        
    
    console.log(artists)
    res.status(200).json({
        status: "success",
        data: artists
    })
})

/**
* A middleware function for Returning an artist whose id is specified in the query
* @function
* @memberof module:controllers/artitViewingController
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getArtist= catchAsync(async (req,res,next)=>{

    const artist=await User.findById(req.params.id,
        {type:0,password:0,email:0,resetPasswordToken:0,resetPasswordExpires:0,
            resetPasswordToken:0, esetPasswordExpires:0,becomePremiumToken:0,
            becomePremiumExpires:0,ecomeArtistToken:0,becomeArtistExpires:0})
        
    if(artist==null || artist.role !== 'artist')
        throw (new AppError("No artist with such an ID",484))

    res.status(200).json({
        status:"sucsess",
        data:artist
    })
})

/**
* A middleware function for Returning related artists to the passed artist id in the query
* @function
* @memberof module:controllers/artitViewingController
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getRelatedArtists= catchAsync(async (req,res)=>{

    const artist=await User.findById(req.params.id)
    if(artist==null || artist.role !== 'artist')
        throw (new AppError("No artist with such an ID",484))
        
    const genres=artist.artistInfo.genres

    let relatedArtists= await User.find({role:'artist',"artistInfo.genres": {$in: genres}},
        {type:0,password:0,email:0,type:0 ,resetPasswordToken:0,resetPasswordExpires:0})

    //removing current artist
    relatedArtists=relatedArtists.filter(el=>el.id!==artist.id)

    if(relatedArtists.length==0)
        throw (new AppError("No related artists found for this artist!",484))
    
    res.status(200).json({
        status:"sucsess",
        data:relatedArtists
    })
})


/**
* A middleware function for Returning albumss for artist whose id is passed in the query
* @function
* @memberof module:controllers/artitViewingController
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getArtistAlbums= catchAsync(async (req,res,next)=>{

    const artist=await User.findById(req.params.id)
    if(artist==null || artist.role !== 'artist')
        throw (new AppError("No artist with such an ID",484))
    
    const features= new APIFeatures(Album.find({"artists": req.params.id,"totalTracks":{$ne: 0}}),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
    
    const albums=await features.query

    if(albums.length==0)
        throw (new AppError("No albums for this artist!",484))

    res.status(200).json({
        status:"sucsess",
        data:albums
    })
})


/**
* A middleware function for TopTracks for artist whose id is passed in the query
* @function
* @memberof module:controllers/artitViewingController
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getArtistTopTracks= catchAsync(async (req,res,next)=>{

    const artist=await User.findById(req.params.id)
    if(artist==null || artist.role !== 'artist')
        throw (new AppError("No artist with such an ID",484))

    
    req.query.sort='-popularity'
    const features= new APIFeatures(Track.find({artists: req.params.id}),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()

    const tracks=await features.query

    if(tracks.length==0)
        throw (new AppError("No tracks for artist",484))

    res.status(200).json({
        status:"sucsess",
        data:tracks
    })
})

/**
* A middleware function for CreatedPlaylists for artist whose id is passed in the query
* @function
* @memberof module:controllers/artitViewingController
* @param {Request}  - The function takes the request as a parameter to access its body.
* @param {Respond} - The respond sent
* @param {next} - The next function in the middleware
*/
exports.getArtistCreatedPlaylists= catchAsync(async (req,res,next)=>{

    const artist=await User.findById(req.params.id)
    if(artist==null || artist.role !== 'artist')
        throw (new AppError("No artist with such an ID",484))

    const playlists=await Playlist.find({owner:req.params.id})
    if(playlists.length==0)
        throw (new AppError("No created playlists for artist",484))

    res.status(200).json({
        status:"sucsess",
        data:playlists
    })
})