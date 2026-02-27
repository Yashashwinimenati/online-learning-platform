-- USERS (Learners)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  mobile TEXT,
  target_exam TEXT,
  preferred_language TEXT,
  preparation_level TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- EDUCATORS
CREATE TABLE IF NOT EXISTS educators (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  mobile TEXT,
  qualification TEXT,
  experience INTEGER,
  bio TEXT,
  rating REAL DEFAULT 0,
  is_verified BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- COURSES
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  educator_id INTEGER,
  target_exam TEXT,
  language TEXT,
  duration TEXT,
  price INTEGER,
  discounted_price INTEGER,
  course_type TEXT CHECK(course_type IN ('live','recorded')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (educator_id) REFERENCES educators(id)
);

-- LESSONS
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER,
  title TEXT,
  description TEXT,
  video_url TEXT,
  duration INTEGER,
  lesson_order INTEGER,
  is_free BOOLEAN DEFAULT 0,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- ENROLLMENTS
CREATE TABLE IF NOT EXISTS enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  course_id INTEGER,
  enrolled_on DATETIME DEFAULT CURRENT_TIMESTAMP,
  expiry_date DATETIME,
  progress INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  UNIQUE(user_id, course_id)
);

-- WATCH HISTORY
CREATE TABLE IF NOT EXISTS watch_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  lesson_id INTEGER,
  watched_duration INTEGER,
  completed BOOLEAN DEFAULT 0,
  last_watched DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- TESTS
CREATE TABLE IF NOT EXISTS tests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER,
  title TEXT,
  type TEXT CHECK(type IN ('practice','mock','chapter')),
  duration INTEGER,
  max_marks INTEGER,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- QUESTIONS
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_id INTEGER,
  question TEXT,
  option1 TEXT,
  option2 TEXT,
  option3 TEXT,
  option4 TEXT,
  correct_option INTEGER,
  marks INTEGER,
  negative_marks INTEGER,
  FOREIGN KEY (test_id) REFERENCES tests(id)
);

-- TEST ATTEMPTS
CREATE TABLE IF NOT EXISTS test_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  test_id INTEGER,
  score INTEGER,
  time_spent INTEGER,
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (test_id) REFERENCES tests(id)
);

-- SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  price INTEGER,
  duration TEXT,
  features TEXT
);

-- USER SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  subscription_id INTEGER,
  start_date DATETIME,
  end_date DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);