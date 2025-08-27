const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 
const User = require('../models/User');
const Course = require('../models/Course');

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/courses/:courseId
// @desc    Get a single course by ID if user is enrolled
// @access  Private
router.get('/:courseId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const courseId = req.params.courseId;

        if (!user.enrolledCourses.includes(courseId)) {
            return res.status(403).json({ msg: 'Access Denied: You are not enrolled in this course.' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        res.json(course);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- ADMIN ROUTES ---

// @route   POST /api/courses/create
// @desc    (Admin) Create a new course with videos
router.post('/create', async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        const course = await newCourse.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /api/courses/enroll
// @desc    (Admin) Enroll a user in a course
router.post('/enroll', async (req, res) => {
    const { userId, courseId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ msg: 'Course not found' });
        
        if (!user.enrolledCourses.includes(courseId)) {
            user.enrolledCourses.push(courseId);
            await user.save();
        }

        res.json({ msg: 'User successfully enrolled', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;