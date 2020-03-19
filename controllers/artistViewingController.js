const express= require('express')
const APIFeatures= require('./../utils/apiFeatures')

const User=require('./../models/user')
const Album=require('./../models/albumModel')
const Track=require('./../models/trackModel')

exports.getArtists= async(req,res)=>{
    try{        
        const features=new APIFeatures(User.find({artistInfo:{$exists: true}},
            {type:0,password:0,email:0,type:0 ,resetPasswordToken:0,resetPasswordExpires:0}),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    

        const artists= await features.query;
        res.status(200).json({
            status: "success",
            data: artists
        })
    } catch(err){
        res.status(484).json({
            status:'fail',
            message: err
        })
    }
}

exports.getArtist= async (req,res)=>{
    try{
        const artist=await User.findById(req.params.id,
            {type:0,password:0,email:0,type:0 ,resetPasswordToken:0,resetPasswordExpires:0})
        
        //TODO:: change error handling
        if(artist.artistInfo==null)
        {
            throw "Invalid id"
        }

        res.status(200).json({
            status:"sucsess",
            data:artist
        })
    }   catch(err){
        res.status(484).json({
            status:'fail',
            message: err
        })
        
    }
}


exports.getRelatedArtists= async (req,res)=>{
    try{

        const artist=await User.findById(req.params.id)
        //TODO::Change error handling
        if(artist.artistInfo==null)
        {
            throw "Invalid id"
        }
            
        const genres=artist.artistInfo.genres

        let relatedArtists= await User.find({"artistInfo.genres": {$in: genres}},
            {type:0,password:0,email:0,type:0 ,resetPasswordToken:0,resetPasswordExpires:0})

        //removing current artist
        relatedArtists=relatedArtists.filter(el=>el.id!==artist.id)
        
        res.status(200).json({
            status:"sucsess",
            data:relatedArtists
        })
       
    }   catch(err){

        res.status(484).json({
            status:'fail',
            message: err
        })
    }
}

exports.getArtistAlbums= async (req,res)=>{
    try{
        const albums=await Album.find({artists: req.params.id})
        console.log(albums)
        res.status(200).json({
            status:"sucsess",
            data:albums
        })

    } catch(err){
        res.status(484).json({
            status:'fail',
            message: err
        })
    }
}

exports.getArtistTopTracks= async (req,res)=>{
    try{
        req.query.sort='-popularity'
        const Tracks=await Track.find({artists: req.params.id})

        res.status(200).json({
            status:"sucsess",
            data:Tracks
        })

    } catch (err){
            res.status(484).json({
                status:'fail',
                message: err
            })
    }
}