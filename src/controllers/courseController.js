const db = require('../config/database')

// ============================
// GET ALL COURSES
// ============================
const getCourses = (req, res) => {
  const { exam, language, type } = req.query

  let query = `
    SELECT c.*, e.name as educator_name, e.rating
    FROM courses c
    LEFT JOIN educators e ON c.educator_id = e.id
    WHERE 1=1
  `

  const params = []

  if (exam) {
    query += ' AND c.target_exam = ?'
    params.push(exam)
  }

  if (language) {
    query += ' AND c.language = ?'
    params.push(language)
  }

  if (type) {
    query += ' AND c.course_type = ?'
    params.push(type)
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message })
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
const createCourse = (req, res) => {
  const { title, description, price, target_exam, language, course_type } = req.body

  const educator_id = req.user.id

  const query = `
    INSERT INTO courses (educator_id, title, description, price, target_exam, language, course_type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `

  db.run(
    query,
    [educator_id, title, description, price, target_exam, language, course_type],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message })
      }

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        courseId: this.lastID
      })
    }
  )
}

module.exports = { getCourses, createCourse }