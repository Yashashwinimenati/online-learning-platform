const express = require('express')
const router = express.Router()

const { getCourses, createCourse } = require('../controllers/courseController')
const { authenticateUser } = require('../middleware/auth')

router.get('/', getCourses)
router.post('/', authenticateUser, createCourse)

module.exports = router