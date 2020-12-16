const mongoose = require('mongoose')
const RefreshTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Refresh Tokens', RefreshTokenSchema)