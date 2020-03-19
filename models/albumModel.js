const mongoose=require('mongoose')

const albumModel= mongoose.Schema({
    albumType:{
        type: String,
        required: [true, "Album must have a type"]
    },
    artists:
    {
        type: [String],//array of user id strings
        required: [true, "Album must have (an) artist(s)"]
    },
    copyrights:{
        type: [String],
    },
    externalUrl:{
        type: [String],//array of external url ids
    },
    genres:{
        type: [String],
        //required: [true,"album must have genres"]
    },
    href:{
        type: String,
        //required: [true,"album must have a ref"]
    },
    label:
    {
        type: String
    },
    name:
    {
        type: String,
        required: [true,"album must have a name"]
    },
    popularity:
    {
        type: Number,
        default:0
    },
    releaseDate:
    {
        type: Date
    },
    uri:
    {
        type: String,
        //required: [true,"album must have a uri"]
    }
})

const albumscheme= mongoose.model('albums',albumModel)
module.exports=albumscheme