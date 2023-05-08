const mongoose = require('mongoose')


const articleSchema = new mongoose.Schema({

    designation:{
        type:String,
        default:null,
    },
    text: {
        type: String,
        default: null,
    },
    photos: {
        type: String,
        required: false
    },
    addresse: [{
        type:Number
    }],
    date:{
        type : Date,
        default : Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
});

/*
userSchema.pre('save', function() {
    const user = this;

})
*/

module.exports = mongoose.model("article", articleSchema);