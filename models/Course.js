const mongoose = require('mongoose');

// Sub-schema for videos
const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // Optional: for dynamic category display
    category: {
        type: String,
        default: 'General'
    },
    videos: [VideoSchema]
});

module.exports = mongoose.model('Course', CourseSchema);