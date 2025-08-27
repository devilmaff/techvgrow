const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    submissionDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);