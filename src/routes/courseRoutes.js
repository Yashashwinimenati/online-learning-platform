const express = require('express')
const router = express.Router()

const protect = require('../middleware/auth')

// ✅ Correct destructuring import
const { getCourses,createCourse,enrollCourse,getMyCourses} = require('../controllers/courseController')

// GET all courses
router.get('/', getCourses)

// CREATE course (educator only)
router.post('/', protect, createCourse)
router.get('/my-courses', protect, getMyCourses)

// ✅ ENROLL IN COURSE (learner only)
router.post('/:id/enroll', protect, enrollCourse)

module.exports = router