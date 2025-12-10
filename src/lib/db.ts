import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Connected to SQLite database at', dbPath);

// Initialize DB
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

    // Check and seed
    db.get("SELECT count(*) as count FROM users", (err, row: any) => {
        if (row && row.count === 0) {
            const stmt = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
            stmt.run("Test User", "test@example.com", "password123");
            stmt.finalize();
            console.log("Seeded test user: test@example.com / password123");
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
