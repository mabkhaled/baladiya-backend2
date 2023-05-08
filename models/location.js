const mongoose = require('mongoose')


const locationSchema = new mongoose.Schema({

    name: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address'
    }
})

module.exports = mongoose.model("location", locationSchema)