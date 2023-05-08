const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({


    lastName: {
        type: String,
        required: false,
    },
    firstName: {
        type: String,
        required: false,
    },
    emailAddress: {
        type: String,
        required: false
    },
    birthdate: {
        type: Date,
        default: Date.now,
    },
    gender: {
        type: String,
        default: "male",
    },
    civilStatus: {
        type: String,
        default: "single",
    },
    cin: {
        type: Number,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    photos: {
        type: String,
        required: false
    },
    token: {
        type: String,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
        default:"This address"
    },
    claims: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'claim',
        default: null
    }],
    Municipalitys: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'municipality',
         default: null
    }],
    role: {
        type: String,
        enum: ['Citoyen', 'Admin'],
        default: 'Citoyen'
    }
});

/*
userSchema.pre('save', function() {
    const user = this;

})
*/

module.exports = mongoose.model("user", userSchema);