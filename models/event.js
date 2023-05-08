const mongoose = require('mongoose')


const eventSchema = new mongoose.Schema({

    name: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        default: null,
    },
    date: {
        type: Date,
        default: Date.now
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address'
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: null,
    }
})

module.exports = mongoose.model("event", eventSchema)