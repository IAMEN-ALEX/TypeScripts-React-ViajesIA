import { sql } from '@vercel/postgres';
import sqlite3 from 'sqlite3';
import path from 'path';

// Detect if running on Vercel (Postgres) or locally (SQLite)
const isVercel = !!process.env.POSTGRES_URL;

let db: sqlite3.Database | null = null;

// Initialize SQLite for local development
if (!isVercel) {
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  db = new sqlite3.Database(dbPath);
  console.log('Connected to SQLite database at', dbPath);

  // Initialize SQLite tables
  db.serialize(() => {
    // Users table
    db!.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
      )
    `);

    // Trips table
    db!.run(`
      CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        destination TEXT,
        start_date TEXT,
        end_date TEXT
      )
    `);

    // Notes table
    db!.run(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER,
        content TEXT,
        FOREIGN KEY(trip_id) REFERENCES trips(id) ON DELETE CASCADE
      )
    `);

    // Seed users for local dev
    db!.get("SELECT count(*) as count FROM users", (err, row: any) => {
      if (row && row.count === 0) {
        const stmt = db!.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        stmt.run("Test User", "test@example.com", "password123");
        stmt.run("Alexis Menares", "menaresalexis34@gmail.com", "123456");
        stmt.finalize();
        console.log("Seeded test users");
      }
    });
  });
});
}

// Helper to convert ? to $1, $2, etc. for Postgres
const formatQuery = (text: string): string => {
  let i = 0;
  return text.replace(/\?/g, () => `$${++i}`);
};

// Universal query function
export const query = async (queryString: string, params: any[] = []): Promise<any[]> => {
  if (isVercel) {
    // Use Vercel Postgres
    const formattedQuery = formatQuery(queryString);
    const result = await sql.query(formattedQuery, params);
    return result.rows;
  } else {
    // Use SQLite
    return new Promise((resolve, reject) => {
      db!.all(queryString, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

// Universal get function (single row)
export const get = async (queryString: string, params: any[] = []): Promise<any> => {
  if (isVercel) {
    // Use Vercel Postgres
    const formattedQuery = formatQuery(queryString);
    const result = await sql.query(formattedQuery, params);
    return result.rows[0];
  } else {
    // Use SQLite
    return new Promise((resolve, reject) => {
      db!.get(queryString, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
};

// Universal run function (INSERT, UPDATE, DELETE)
export const run = async (queryString: string, params: any[] = []): Promise<any> => {
  if (isVercel) {
    // Use Vercel Postgres
    let formattedQuery = formatQuery(queryString);

    // If it's an INSERT, we need to return the ID to match SQLite behavior
    if (/^INSERT\s/i.test(formattedQuery.trim()) && !/RETURNING/i.test(formattedQuery)) {
      formattedQuery += ' RETURNING id';
    }

    try {
      const result = await sql.query(formattedQuery, params);
      // Map Postgres result to SQLite-style result object
      // For INSERT with RETURNING id, the id will be in rows[0].id
      return {
        lastID: result.rows[0]?.id || 0,
        changes: result.rowCount
      };
    } catch (error) {
      console.error('Database Error:', error);
      throw error;
    }
  } else {
    // Use SQLite
    return new Promise((resolve, reject) => {
      db!.run(queryString, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
};

export const getDb = () => db;
