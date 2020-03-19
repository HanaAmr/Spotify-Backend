const mongoose=require('mongoose')
const Schema=mongoose.schema

const copyrightSchema=mongoose.schema({
    text:{
        type: String,
        required:[true, 'A copyright object must have text']
    },
    type:{
        type: String,
        required:[true,'A copyright object must have a type']
    }
})

const copyright=mongoose.model('copyrights',copyrightSchema)
module.children=copyright