const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const path = require('path')

// ✅ Create database connection FIRST
const db = new sqlite3.Database('./database/database.sqlite', (err) => {
  if (err) {
    console.error('Database connection error:', err)
  } else {
    console.log('Connected to SQLite database')

    // ✅ After connection, load schema
    const schemaPath = path.join(__dirname, '../../database/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    db.exec(schema, (err) => {
      if (err) {
        console.error('Schema execution error:', err)
      } else {
        console.log('All tables created successfully')
      }
    })
  }
})

module.exports = db