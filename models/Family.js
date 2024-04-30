const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    adminId: {
        type: Schema.ObjectId,
        ref: 'user'
    },
    start_time: {
        type: String,
    },
    end_time: {
        type: String,
    },
    time_status: {
        type: String,
        default: '0'
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('family', userSchema);