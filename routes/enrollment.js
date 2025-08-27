const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Course = require('../models/Course');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// @route   GET /api/enrollment
// @desc    Get all enrollment submissions
router.get('/', [auth, admin], async (req, res) => {
    try {
        const submissions = await Enrollment.find().sort({ submissionDate: -1 });
        res.json(submissions);
    } catch (err) {
        console.error('Error fetching enrollments:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/enrollment/approve/:id
// @desc    Approve an enrollment and grant user access
router.post('/approve/:id', [auth, admin], async (req, res) => {
    try {
        const submissionId = req.params.id;
        const submission = await Enrollment.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ msg: 'Submission not found.' });
        }
        const user = await User.findOne({ email: submission.email });
        if (!user) {
            return res.status(404).json({ msg: `User with email ${submission.email} has not signed up yet.` });
        }
        const course = await Course.findOne({ 
            $or: [{ _id: submission.course }, { title: submission.course }, { slug: submission.course }]
        });
        if (!course) {
            return res.status(404).json({ msg: `Course "${submission.course}" not found.` });
        }
        if (!user.enrolledCourses.includes(course._id)) {
            user.enrolledCourses.push(course._id);
            await user.save();
        }
        await Enrollment.findByIdAndDelete(submissionId);
        res.json({ msg: 'User successfully enrolled and submission approved.' });
    } catch (err) {
        console.error('Approval Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/enrollment/submit
// @desc    Handle a new course enrollment application
router.post('/submit', async (req, res) => {
    try {
        const { name, email, phone, course } = req.body;
        const newEnrollment = new Enrollment({ name, email, phone, course });
        await newEnrollment.save();
        res.redirect('/thankyou.html');
    } catch (err) {
        console.error('Enrollment submission error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;