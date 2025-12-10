import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Connected to SQLite database at', dbPath);

// Initialize DB
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  // Trips table
  db.run(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destination TEXT,
      start_date TEXT,
      end_date TEXT
    )
  `);

  // Notes table
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER,
      content TEXT,
      FOREIGN KEY(trip_id) REFERENCES trips(id) ON DELETE CASCADE
    )
  `);

  // Check and seed users
  db.get("SELECT count(*) as count FROM users", (err, row: any) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
      stmt.run("Test User", "test@example.com", "password123");
      stmt.finalize();
      console.log("Seeded test user: test@example.com / password123");
    }
  });

  // Ensure specific user exists
  db.get("SELECT id FROM users WHERE email = ?", ["menaresalexis34@gmail.com"], (err, row) => {
    if (!row) {
      const stmt = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
      stmt.run("Alexis Menares", "menaresalexis34@gmail.com", "123456");
      stmt.finalize();
      console.log("Seeded custom user: menaresalexis34@gmail.com / 123456");
    }
  });
});

export const getDb = () => db;

export const query = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const get = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};
