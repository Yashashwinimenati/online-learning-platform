const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const authRoutes = require('./routes/authRoutes')
const courseRoutes = require('./routes/courseRoutes') // ADD THIS

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Online Learning Platform API Running ')
})

app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes) // REGISTER

module.exports = app