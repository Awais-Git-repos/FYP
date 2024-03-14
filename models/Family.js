const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null,
    },
    contact: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
    },
    time_access: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('family', userSchema);