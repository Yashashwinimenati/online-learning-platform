const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/database')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const SALT_ROUNDS = 10

const dbGet = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })

const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err)
      else resolve({ id: this.lastID, changes: this.changes })
    })
  })

const register = async (req, res) => {
  try {
    const { name, email, password, role, mobile } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      })
    }

    if (role && !['learner', 'educator'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'learner' or 'educator'"
      })
    }

    const existingUser = await dbGet('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()])
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const result = await dbRun(
      'INSERT INTO users (name, email, password, role, mobile) VALUES (?, ?, ?, ?, ?)',
      [
        (name || '').trim(),
        email.toLowerCase().trim(),
        hashedPassword,
        role || 'learner',
        (mobile || '').trim()
      ]
    )

    const user = await dbGet('SELECT id, name, email, role, mobile, created_at FROM users WHERE id = ?', [result.id])
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
          created_at: user.created_at
        },
        token
      }
    })
  } catch (error) {
    console.error('Register error FULL:', error.message)
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while registering the user'
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    const user = await dbGet(
      'SELECT id, name, email, password, role, mobile, created_at FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    )

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
          created_at: user.created_at
        },
        token
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while logging in'
    })
  }
}

module.exports = {
  register,
  login
}
