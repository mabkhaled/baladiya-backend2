const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    emailAddress: { type: String, required: true, ref: 'User' },
    token: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } }
});

module.exports = mongoose.model('Token', tokenSchema);