const mongoose = require('mongoose');

// ...
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // ADD THIS ROLE FIELD
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});




module.exports = mongoose.model('User', UserSchema);