const mongoose = require('mongoose')

const claimSchema = new mongoose.Schema({

    name : {
        type : String,
        default : null

    },
    type : {
        type : String,
        default : null,
        required: false
    },
    date : {
        type : Date,
        default : Date.now
    },
    photos : {
        type : String,
        default : null
    },
    text : {
        type : String,
        default : null
    },
    
    laltitude : {
        type : Number,
        required: false,
        default:null
    },
    longitude: {
        type : Number,
        required: false,
        default:null

    },
author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

module.exports = mongoose.model("claim", claimSchema);