    const mongoose = require('mongoose')

    const addressSchema = new mongoose.Schema({

    street : {
        type : String,
        default: null,
    },
    city : {
        type : String,
        default: null,
    },
    state : {
        type : String,
        default: null,
    },
    postalCode :{
        type : Number,
        default: null,
    },
    country : {
        type : String,
        default: null,
    },
    user : {
       type :  mongoose.Schema.Types.ObjectId,
       ref : 'user',
       default: null,
    }
});

module.exports = mongoose.model("address", addressSchema);