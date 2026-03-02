const db = require('../config/database')

// ============================
// GET ALL COURSES
// ============================
const getCourses = (req, res) => {
  const query = `
    SELECT * FROM courses
  `

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      })
    }

    res.json({
      success: true,
      courses: rows
    })
  })
}

// ============================
// CREATE COURSE
// ============================
const createCourse = async (req, res) => {
  try {
    let { title, description, price, target_exam, language, course_type } = req.body

    if (req.user.role !== 'educator') {
      return res.status(403).json({
        success: false,
        message: 'Only educators can create courses'
      })
    }

    if (!title || !description || !price || !target_exam || !language || !course_type) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    course_type = course_type.toLowerCase()

    if (!['live', 'recorded'].includes(course_type)) {
      return res.status(400).json({
        success: false,
        message: "course_type must be 'live' or 'recorded'"
      })
    }

    const query = `
      INSERT INTO courses 
      (title, description, price, target_exam, language, course_type, educator_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    db.run(
      query,
      [title, description, price, target_exam, language, course_type, req.user.id],
      function (err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message
          })
        }

        res.status(201).json({
          success: true,
          message: 'Course created successfully',
          courseId: this.lastID
        })
      }
    )

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const enrollCourse = (req, res) => {
    const courseId = req.params.id
    const userId = req.user.id
  
    // Only learners can enroll
    if (req.user.role !== 'learner') {
      return res.status(403).json({
        success: false,
        message: 'Only learners can enroll in courses'
      })
    }
  
    const query = `
      INSERT INTO enrollments (user_id, course_id)
      VALUES (?, ?)
    `
  
    db.run(query, [userId, courseId], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({
            success: false,
            message: 'Already enrolled in this course'
          })
        }
  
        return res.status(500).json({
          success: false,
          message: err.message
        })
      }
  
      res.status(201).json({
        success: true,
        message: 'Enrolled successfully'
      })
    })
  }
  const getMyCourses = (req, res) => {
    const userId = req.user.id
  
    if (req.user.role !== 'learner') {
      return res.status(403).json({
        success: false,
        message: 'Only learners can access enrolled courses'
      })
    }
  
    const query = `
      SELECT c.*
      FROM courses c
      INNER JOIN enrollments e ON c.id = e.course_id
      WHERE e.user_id = ?
    `
  
    db.all(query, [userId], (err, courses) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        })
      }
  
      res.json({
        success: true,
        courses
      })
    })
  }
module.exports = { getCourses, createCourse ,enrollCourse,getMyCourses}