const mongoose=require('mongoose')

//TODO:: add track reference

const trackSchema=mongoose.Schema({
    name:{
        type:String,
        required: [true, "Track must have a name"]

    },
    album:{ //refernce to album containing track
        type: String,
        required: [true, "A track must have an album"]
    },
    trackNumber:{
        type: Number,
        required: [true, "A track must be ordered in the album (track Number)"]
    },
    artists :{//refernce to artists producing the track
        type:   [String],
        required: [true, "A track must have artists"]
    },
    genres:{
        type: [String],
        required:[true,"A track must have at list one genre"]
    },
    isLocal:{
        type: Boolean,
        required: [true, "A track must have an isLocal bit"]
    },
    durationMs:{
        type: Number,
        required: [true, "A track must contain its duration"]
    },
    previewUrl: {
        type: String,
        //required: [true, "A track must have a preview URL"]
    },
    popularity:{    //total number of likes for a track    
        type: Number,
        default:0
    },
    uri:{
        type: String,
        //required: [true, "A track must have a spotify URI"]
    },
    href:{
        type: String,
        required: [true, "A track must have a refernce"]
    },
    externalUrls:{
        type: [String]
    }
})

const track=mongoose.model('tracks',trackSchema)
module.exports=track