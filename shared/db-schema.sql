-- HSC Academic Hub Unified Database Schema (SQLite: hsc.db)

CREATE TABLE IF NOT EXISTS students (
    phone TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    group_name TEXT NOT NULL,
    password_hash TEXT,
    is_paid INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_phone TEXT NOT NULL,
    amount INTEGER DEFAULT 999,
    method TEXT NOT NULL,
    trx_id TEXT UNIQUE,
    provider_ref TEXT,
    verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_phone) REFERENCES students(phone)
);

CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_phone TEXT NOT NULL,
    chapter_id TEXT NOT NULL,
    video_watched INTEGER DEFAULT 0,
    test_done INTEGER DEFAULT 0,
    last_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_phone, chapter_id),
    FOREIGN KEY (student_phone) REFERENCES students(phone)
);

CREATE TABLE IF NOT EXISTS checkin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_phone TEXT NOT NULL,
    checkin_date DATE NOT NULL,
    streak INTEGER DEFAULT 1,
    UNIQUE(student_phone, checkin_date),
    FOREIGN KEY (student_phone) REFERENCES students(phone)
);

CREATE TABLE IF NOT EXISTS wrong_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_phone TEXT NOT NULL,
    question_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_phone) REFERENCES students(phone)
);

CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_phone TEXT NOT NULL,
    test_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_phone) REFERENCES students(phone)
);
