require('dotenv').config()
const app = require('./src/app')

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const courseRoutes = require('./src/routes/courseRoutes')
app.use('/api/courses', courseRoutes)