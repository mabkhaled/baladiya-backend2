const mongoose = require('mongoose')


const municipalitySchema = new mongoose.Schema({

    name: {
        type: String,
        default: null
    },
    phoneNumber: {
        type: Number,
        default: null
    },
    emailAddress: {
        type: String,
        default: null
    },
    workSchedule: {
        type: Date,
        default: null
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address'
    }

});

module.exports = mongoose.model("municipality", municipalitySchema);