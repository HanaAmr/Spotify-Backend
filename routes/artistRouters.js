const express=require('express')
const artistViewingController=require('./../controllers/artistViewingController')


const router=express.Router()

router
    .route('/')
    .get(artistViewingController.getArtists)

router
    .route('/:id')
    .get(artistViewingController.getArtist)

router
    .route('/:id/related-artists')
    .get(artistViewingController.getRelatedArtists)

router
    .route('/:id/albums')
    .get(artistViewingController.getArtistAlbums)

router
    .route('/:id/top-tracks')
    .get(artistViewingController.getArtistTopTracks)

module.exports=router